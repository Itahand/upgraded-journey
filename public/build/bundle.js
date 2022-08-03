
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Modal.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/Modal.svelte";
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$1(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let hr0;
    	let t2;
    	let t3;
    	let hr1;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*#slots*/ ctx[4].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[3], get_header_slot_context);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			hr1 = element("hr");
    			t4 = space();
    			button = element("button");
    			button.textContent = "close modal";
    			attr_dev(div0, "class", "modal-background svelte-1k3utew");
    			add_location(div0, file$1, 41, 0, 890);
    			add_location(hr0, file$1, 45, 1, 1045);
    			add_location(hr1, file$1, 47, 1, 1066);
    			button.autofocus = true;
    			attr_dev(button, "class", "svelte-1k3utew");
    			add_location(button, file$1, 50, 1, 1112);
    			attr_dev(div1, "class", "modal svelte-1k3utew");
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");
    			add_location(div1, file$1, 43, 0, 945);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, hr0);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t3);
    			append_dev(div1, hr1);
    			append_dev(div1, t4);
    			append_dev(div1, button);
    			/*div1_binding*/ ctx[5](div1);
    			current = true;
    			button.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handle_keydown*/ ctx[2], false, false, false),
    					listen_dev(div0, "click", /*close*/ ctx[1], false, false, false),
    					listen_dev(button, "click", /*close*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[3], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['header','default']);
    	const dispatch = createEventDispatcher();
    	const close = () => dispatch('close');
    	let modal;

    	const handle_keydown = e => {
    		if (e.key === 'Escape') {
    			close();
    			return;
    		}

    		if (e.key === 'Tab') {
    			// trap focus
    			const nodes = modal.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && e.shiftKey) index = 0;
    			index += tabbable.length + (e.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			e.preventDefault();
    		}
    	};

    	const previously_focused = typeof document !== 'undefined' && document.activeElement;

    	if (previously_focused) {
    		onDestroy(() => {
    			previously_focused.focus();
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(0, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		dispatch,
    		close,
    		modal,
    		handle_keydown,
    		previously_focused
    	});

    	$$self.$inject_state = $$props => {
    		if ('modal' in $$props) $$invalidate(0, modal = $$props.modal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modal, close, handle_keydown, $$scope, slots, div1_binding];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    // (48:4) {:else}
    function create_else_block_5(ctx) {
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Introdución";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "My Proyecto";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Servicios";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Contactar";
    			t7 = space();
    			button = element("button");
    			button.textContent = "English";
    			attr_dev(a0, "href", '#');
    			attr_dev(a0, "class", "svelte-tfzw9p");
    			add_location(a0, file, 50, 5, 1176);
    			attr_dev(li0, "class", "svelte-tfzw9p");
    			add_location(li0, file, 49, 4, 1166);
    			attr_dev(a1, "href", '#');
    			attr_dev(a1, "class", "svelte-tfzw9p");
    			add_location(a1, file, 53, 5, 1288);
    			attr_dev(li1, "class", "svelte-tfzw9p");
    			add_location(li1, file, 52, 4, 1278);
    			attr_dev(a2, "href", '#');
    			attr_dev(a2, "class", "svelte-tfzw9p");
    			add_location(a2, file, 56, 5, 1405);
    			attr_dev(li2, "class", "svelte-tfzw9p");
    			add_location(li2, file, 55, 4, 1395);
    			attr_dev(a3, "href", '#');
    			attr_dev(a3, "class", "svelte-tfzw9p");
    			add_location(a3, file, 59, 5, 1519);
    			attr_dev(li3, "class", "svelte-tfzw9p");
    			add_location(li3, file, 58, 4, 1509);
    			attr_dev(button, "class", "svelte-tfzw9p");
    			add_location(button, file, 61, 4, 1624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, li3, anchor);
    			append_dev(li3, a3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(/*click_handler_4*/ ctx[8]), false, true, false),
    					listen_dev(a1, "click", prevent_default(/*click_handler_5*/ ctx[9]), false, true, false),
    					listen_dev(a2, "click", prevent_default(/*click_handler_6*/ ctx[10]), false, true, false),
    					listen_dev(a3, "click", prevent_default(/*click_handler_7*/ ctx[11]), false, true, false),
    					listen_dev(button, "click", /*toggle*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(li3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if !lang.spanish}
    function create_if_block_6(ctx) {
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let button0;
    	let t7;
    	let br;
    	let t8;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "About";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "My Project";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Contact";
    			t5 = space();
    			button0 = element("button");
    			button0.textContent = "show modal";
    			t7 = space();
    			br = element("br");
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Español";
    			attr_dev(a0, "href", '#');
    			attr_dev(a0, "class", "svelte-tfzw9p");
    			add_location(a0, file, 32, 5, 680);
    			attr_dev(li0, "class", "svelte-tfzw9p");
    			add_location(li0, file, 31, 4, 670);
    			attr_dev(a1, "href", '#');
    			attr_dev(a1, "class", "svelte-tfzw9p");
    			add_location(a1, file, 35, 5, 786);
    			attr_dev(li1, "class", "svelte-tfzw9p");
    			add_location(li1, file, 34, 4, 776);
    			attr_dev(a2, "href", '#');
    			attr_dev(a2, "class", "svelte-tfzw9p");
    			add_location(a2, file, 38, 5, 902);
    			attr_dev(li2, "class", "svelte-tfzw9p");
    			add_location(li2, file, 37, 4, 892);
    			attr_dev(button0, "id", "modal");
    			attr_dev(button0, "class", "svelte-tfzw9p");
    			add_location(button0, file, 40, 4, 1005);
    			attr_dev(br, "class", "svelte-tfzw9p");
    			add_location(br, file, 43, 4, 1095);
    			attr_dev(button1, "class", "svelte-tfzw9p");
    			add_location(button1, file, 44, 4, 1104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, li2, anchor);
    			append_dev(li2, a2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(/*click_handler*/ ctx[4]), false, true, false),
    					listen_dev(a1, "click", prevent_default(/*click_handler_1*/ ctx[5]), false, true, false),
    					listen_dev(a2, "click", prevent_default(/*click_handler_2*/ ctx[6]), false, true, false),
    					listen_dev(button0, "click", /*click_handler_3*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*toggle*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(li2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(31:4) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (74:1) {:else}
    function create_else_block_4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "English";
    			attr_dev(button, "class", "idioma svelte-tfzw9p");
    			add_location(button, file, 74, 1, 1813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(74:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:1) {#if !lang.spanish}
    function create_if_block_5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Español";
    			attr_dev(button, "class", "idioma svelte-tfzw9p");
    			add_location(button, file, 70, 1, 1740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggle*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(70:1) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (102:3) {:else}
    function create_else_block_3(ctx) {
    	let p;
    	let t1;
    	let div;
    	let br0;
    	let t2;
    	let br1;
    	let t3;
    	let t4;
    	let button;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Tengo experiencia trabajando en ambientes ágiles y poseo una pasión innata por la tecnología blockchain. Me especializo en smart contracts que cumplen los standards y poseen un valor de utilidad, especialmente en el espacio DeFi. Yo te puedo ayudar con desarrollo de dApps, con desarrollo de Smart Contracts, con desarrollo de Front-end más integración a Blockchain, y accesoría en Blockchain.";
    			t1 = space();
    			div = element("div");
    			br0 = element("br");
    			t2 = text("\n\t\t\t\tQuieres experimentar con mis dApps? ");
    			br1 = element("br");
    			t3 = text("\n\t\t\t\tReclama tus tokens y disfruta ahora mismo!");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Reclama NOAH gratis";
    			attr_dev(p, "class", "svelte-tfzw9p");
    			add_location(p, file, 103, 3, 2643);
    			attr_dev(br0, "class", "svelte-tfzw9p");
    			add_location(br0, file, 108, 4, 3067);
    			attr_dev(br1, "class", "svelte-tfzw9p");
    			add_location(br1, file, 109, 40, 3112);
    			attr_dev(div, "class", "svelte-tfzw9p");
    			add_location(div, file, 107, 3, 3057);
    			attr_dev(button, "class", "svelte-tfzw9p");
    			add_location(button, file, 113, 3, 3178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, br1);
    			append_dev(div, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(102:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:3) {#if !lang.spanish}
    function create_if_block_4(ctx) {
    	let p;
    	let t1;
    	let div;
    	let br0;
    	let t2;
    	let br1;
    	let t3;
    	let t4;
    	let button;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Development with a focus on usability. I can help you with Blockchain Application Development, Smart contract development, Front-end development, and Blockchain Consulting.";
    			t1 = space();
    			div = element("div");
    			br0 = element("br");
    			t2 = text("\n\t\t\t\tWant to experience more on my dApps? ");
    			br1 = element("br");
    			t3 = text("\n\t\t\t\tClaim your free tokens and enjoy now!");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Free NOAH token";
    			attr_dev(p, "class", "svelte-tfzw9p");
    			add_location(p, file, 87, 3, 2118);
    			attr_dev(br0, "class", "svelte-tfzw9p");
    			add_location(br0, file, 92, 4, 2478);
    			attr_dev(br1, "class", "svelte-tfzw9p");
    			add_location(br1, file, 93, 41, 2524);
    			attr_dev(div, "class", "svelte-tfzw9p");
    			add_location(div, file, 91, 3, 2468);
    			attr_dev(button, "class", "svelte-tfzw9p");
    			add_location(button, file, 97, 3, 2585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, br1);
    			append_dev(div, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(87:3) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (138:1) {:else}
    function create_else_block_2(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let div0;
    	let t4;
    	let div1;
    	let t5;
    	let div2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Mi Proyecto";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			t3 = space();
    			div0 = element("div");
    			t4 = space();
    			div1 = element("div");
    			t5 = space();
    			div2 = element("div");
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 140, 2, 3881);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 141, 2, 3904);
    			attr_dev(div0, "class", "svelte-tfzw9p");
    			add_location(div0, file, 142, 2, 4360);
    			attr_dev(div1, "class", "svelte-tfzw9p");
    			add_location(div1, file, 145, 2, 4378);
    			attr_dev(div2, "class", "svelte-tfzw9p");
    			add_location(div2, file, 148, 2, 4396);
    			attr_dev(section, "id", "portafolio");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 139, 1, 3853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    			append_dev(section, t3);
    			append_dev(section, div0);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(section, t5);
    			append_dev(section, div2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(138:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (121:1) {#if !lang.spanish}
    function create_if_block_3(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let div0;
    	let t4;
    	let div1;
    	let t5;
    	let div2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "My Project";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			t3 = space();
    			div0 = element("div");
    			t4 = space();
    			div1 = element("div");
    			t5 = space();
    			div2 = element("div");
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 124, 2, 3299);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 125, 2, 3321);
    			attr_dev(div0, "class", "svelte-tfzw9p");
    			add_location(div0, file, 126, 2, 3777);
    			attr_dev(div1, "class", "svelte-tfzw9p");
    			add_location(div1, file, 129, 2, 3795);
    			attr_dev(div2, "class", "svelte-tfzw9p");
    			add_location(div2, file, 132, 2, 3813);
    			attr_dev(section, "id", "portafolio");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 122, 1, 3270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    			append_dev(section, t3);
    			append_dev(section, div0);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(section, t5);
    			append_dev(section, div2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(121:1) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (224:1) {:else}
    function create_else_block_1(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Servicios";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 226, 2, 6014);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 227, 2, 6035);
    			attr_dev(section, "id", "servicios");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 225, 1, 5987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(224:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (155:0) {#if !lang.spanish}
    function create_if_block_2(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let table;
    	let tr0;
    	let th0;
    	let t5;
    	let th1;
    	let t6;
    	let br0;
    	let t7;
    	let ul0;
    	let li0;
    	let t9;
    	let li1;
    	let t11;
    	let li2;
    	let t13;
    	let th2;
    	let t14;
    	let br1;
    	let t15;
    	let ul1;
    	let li3;
    	let t17;
    	let li4;
    	let t18;
    	let br2;
    	let t19;
    	let t20;
    	let th3;
    	let t21;
    	let br3;
    	let t22;
    	let ul2;
    	let li5;
    	let t24;
    	let li6;
    	let t26;
    	let tr1;
    	let td0;
    	let t28;
    	let td1;
    	let t30;
    	let td2;
    	let t32;
    	let td3;
    	let t34;
    	let tr2;
    	let td4;
    	let t36;
    	let td5;
    	let t37;
    	let br4;
    	let t38;
    	let t39;
    	let td6;
    	let t40;
    	let br5;
    	let t41;
    	let t42;
    	let td7;
    	let t43;
    	let br6;
    	let t44;
    	let t45;
    	let tr3;
    	let td8;
    	let t47;
    	let td9;
    	let t48;
    	let br7;
    	let t49;
    	let button0;
    	let t51;
    	let td10;
    	let t52;
    	let br8;
    	let t53;
    	let button1;
    	let t55;
    	let td11;
    	let t56;
    	let br9;
    	let t57;
    	let button2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Services";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			t3 = space();
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Package";
    			t5 = space();
    			th1 = element("th");
    			t6 = text("Basic Website\n\t\t\t\t\t");
    			br0 = element("br");
    			t7 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "NFT Mint Engine";
    			t9 = space();
    			li1 = element("li");
    			li1.textContent = "NFT Mint Function";
    			t11 = space();
    			li2 = element("li");
    			li2.textContent = "Responvsive 1 page website";
    			t13 = space();
    			th2 = element("th");
    			t14 = text("Standard Website\n\t\t\t\t\t");
    			br1 = element("br");
    			t15 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Basic included";
    			t17 = space();
    			li4 = element("li");
    			t18 = text("Artwork and Metadata generation");
    			br2 = element("br");
    			t19 = text(" from layer images you provide");
    			t20 = space();
    			th3 = element("th");
    			t21 = text("Premium Website\n\t\t\t\t\t");
    			br3 = element("br");
    			t22 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			li5.textContent = "Standard included";
    			t24 = space();
    			li6 = element("li");
    			li6.textContent = "Custom requests";
    			t26 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Revisions";
    			t28 = space();
    			td1 = element("td");
    			td1.textContent = "2";
    			t30 = space();
    			td2 = element("td");
    			td2.textContent = "5";
    			t32 = space();
    			td3 = element("td");
    			td3.textContent = "Unlimited";
    			t34 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Delivery Time";
    			t36 = space();
    			td5 = element("td");
    			t37 = text("7");
    			br4 = element("br");
    			t38 = text("8");
    			t39 = space();
    			td6 = element("td");
    			t40 = text("7");
    			br5 = element("br");
    			t41 = text("9");
    			t42 = space();
    			td7 = element("td");
    			t43 = text("7");
    			br6 = element("br");
    			t44 = text("10");
    			t45 = space();
    			tr3 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Total";
    			t47 = space();
    			td9 = element("td");
    			t48 = text("$300");
    			br7 = element("br");
    			t49 = space();
    			button0 = element("button");
    			button0.textContent = "Select";
    			t51 = space();
    			td10 = element("td");
    			t52 = text("$350");
    			br8 = element("br");
    			t53 = space();
    			button1 = element("button");
    			button1.textContent = "Select";
    			t55 = space();
    			td11 = element("td");
    			t56 = text("$400");
    			br9 = element("br");
    			t57 = space();
    			button2 = element("button");
    			button2.textContent = "Select";
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 156, 2, 4480);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 157, 2, 4500);
    			attr_dev(th0, "class", "svelte-tfzw9p");
    			add_location(th0, file, 161, 4, 4996);
    			attr_dev(br0, "class", "svelte-tfzw9p");
    			add_location(br0, file, 164, 5, 5041);
    			attr_dev(li0, "class", "svelte-tfzw9p");
    			add_location(li0, file, 166, 6, 5062);
    			attr_dev(li1, "class", "svelte-tfzw9p");
    			add_location(li1, file, 167, 6, 5093);
    			attr_dev(li2, "class", "svelte-tfzw9p");
    			add_location(li2, file, 168, 6, 5126);
    			attr_dev(ul0, "class", "svelte-tfzw9p");
    			add_location(ul0, file, 165, 5, 5051);
    			attr_dev(th1, "class", "svelte-tfzw9p");
    			add_location(th1, file, 163, 4, 5018);
    			attr_dev(br1, "class", "svelte-tfzw9p");
    			add_location(br1, file, 172, 5, 5213);
    			attr_dev(li3, "class", "svelte-tfzw9p");
    			add_location(li3, file, 174, 6, 5234);
    			attr_dev(br2, "class", "svelte-tfzw9p");
    			add_location(br2, file, 175, 41, 5299);
    			attr_dev(li4, "class", "svelte-tfzw9p");
    			add_location(li4, file, 175, 6, 5264);
    			attr_dev(ul1, "class", "svelte-tfzw9p");
    			add_location(ul1, file, 173, 5, 5223);
    			attr_dev(th2, "class", "svelte-tfzw9p");
    			add_location(th2, file, 171, 4, 5187);
    			attr_dev(br3, "class", "svelte-tfzw9p");
    			add_location(br3, file, 179, 5, 5389);
    			attr_dev(li5, "class", "svelte-tfzw9p");
    			add_location(li5, file, 181, 6, 5410);
    			attr_dev(li6, "class", "svelte-tfzw9p");
    			add_location(li6, file, 182, 6, 5443);
    			attr_dev(ul2, "class", "svelte-tfzw9p");
    			add_location(ul2, file, 180, 5, 5399);
    			attr_dev(th3, "class", "svelte-tfzw9p");
    			add_location(th3, file, 178, 4, 5364);
    			attr_dev(tr0, "class", "svelte-tfzw9p");
    			add_location(tr0, file, 160, 3, 4987);
    			attr_dev(td0, "class", "svelte-tfzw9p");
    			add_location(td0, file, 187, 4, 5510);
    			attr_dev(td1, "class", "svelte-tfzw9p");
    			add_location(td1, file, 188, 4, 5533);
    			attr_dev(td2, "class", "svelte-tfzw9p");
    			add_location(td2, file, 189, 4, 5548);
    			attr_dev(td3, "class", "svelte-tfzw9p");
    			add_location(td3, file, 190, 4, 5563);
    			attr_dev(tr1, "class", "svelte-tfzw9p");
    			add_location(tr1, file, 186, 3, 5501);
    			attr_dev(td4, "class", "svelte-tfzw9p");
    			add_location(td4, file, 193, 4, 5603);
    			attr_dev(br4, "class", "svelte-tfzw9p");
    			add_location(br4, file, 195, 6, 5641);
    			attr_dev(td5, "class", "svelte-tfzw9p");
    			add_location(td5, file, 194, 4, 5630);
    			attr_dev(br5, "class", "svelte-tfzw9p");
    			add_location(br5, file, 198, 6, 5672);
    			attr_dev(td6, "class", "svelte-tfzw9p");
    			add_location(td6, file, 197, 4, 5661);
    			attr_dev(br6, "class", "svelte-tfzw9p");
    			add_location(br6, file, 201, 6, 5703);
    			attr_dev(td7, "class", "svelte-tfzw9p");
    			add_location(td7, file, 200, 4, 5692);
    			attr_dev(tr2, "class", "svelte-tfzw9p");
    			add_location(tr2, file, 192, 3, 5594);
    			attr_dev(td8, "class", "svelte-tfzw9p");
    			add_location(td8, file, 205, 4, 5741);
    			attr_dev(br7, "class", "svelte-tfzw9p");
    			add_location(br7, file, 207, 9, 5774);
    			attr_dev(button0, "class", "svelte-tfzw9p");
    			add_location(button0, file, 208, 5, 5784);
    			attr_dev(td9, "class", "svelte-tfzw9p");
    			add_location(td9, file, 206, 4, 5760);
    			attr_dev(br8, "class", "svelte-tfzw9p");
    			add_location(br8, file, 211, 9, 5836);
    			attr_dev(button1, "class", "svelte-tfzw9p");
    			add_location(button1, file, 212, 5, 5846);
    			attr_dev(td10, "class", "svelte-tfzw9p");
    			add_location(td10, file, 210, 4, 5822);
    			attr_dev(br9, "class", "svelte-tfzw9p");
    			add_location(br9, file, 215, 9, 5898);
    			attr_dev(button2, "class", "svelte-tfzw9p");
    			add_location(button2, file, 216, 5, 5908);
    			attr_dev(td11, "class", "svelte-tfzw9p");
    			add_location(td11, file, 214, 4, 5884);
    			attr_dev(tr3, "class", "svelte-tfzw9p");
    			add_location(tr3, file, 204, 3, 5732);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-tfzw9p");
    			add_location(table, file, 159, 2, 4957);
    			attr_dev(section, "id", "servicios");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 155, 1, 4453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    			append_dev(section, t3);
    			append_dev(section, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t5);
    			append_dev(tr0, th1);
    			append_dev(th1, t6);
    			append_dev(th1, br0);
    			append_dev(th1, t7);
    			append_dev(th1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t9);
    			append_dev(ul0, li1);
    			append_dev(ul0, t11);
    			append_dev(ul0, li2);
    			append_dev(tr0, t13);
    			append_dev(tr0, th2);
    			append_dev(th2, t14);
    			append_dev(th2, br1);
    			append_dev(th2, t15);
    			append_dev(th2, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t17);
    			append_dev(ul1, li4);
    			append_dev(li4, t18);
    			append_dev(li4, br2);
    			append_dev(li4, t19);
    			append_dev(tr0, t20);
    			append_dev(tr0, th3);
    			append_dev(th3, t21);
    			append_dev(th3, br3);
    			append_dev(th3, t22);
    			append_dev(th3, ul2);
    			append_dev(ul2, li5);
    			append_dev(ul2, t24);
    			append_dev(ul2, li6);
    			append_dev(table, t26);
    			append_dev(table, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t28);
    			append_dev(tr1, td1);
    			append_dev(tr1, t30);
    			append_dev(tr1, td2);
    			append_dev(tr1, t32);
    			append_dev(tr1, td3);
    			append_dev(table, t34);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t36);
    			append_dev(tr2, td5);
    			append_dev(td5, t37);
    			append_dev(td5, br4);
    			append_dev(td5, t38);
    			append_dev(tr2, t39);
    			append_dev(tr2, td6);
    			append_dev(td6, t40);
    			append_dev(td6, br5);
    			append_dev(td6, t41);
    			append_dev(tr2, t42);
    			append_dev(tr2, td7);
    			append_dev(td7, t43);
    			append_dev(td7, br6);
    			append_dev(td7, t44);
    			append_dev(table, t45);
    			append_dev(table, tr3);
    			append_dev(tr3, td8);
    			append_dev(tr3, t47);
    			append_dev(tr3, td9);
    			append_dev(td9, t48);
    			append_dev(td9, br7);
    			append_dev(td9, t49);
    			append_dev(td9, button0);
    			append_dev(tr3, t51);
    			append_dev(tr3, td10);
    			append_dev(td10, t52);
    			append_dev(td10, br8);
    			append_dev(td10, t53);
    			append_dev(td10, button1);
    			append_dev(tr3, t55);
    			append_dev(tr3, td11);
    			append_dev(td11, t56);
    			append_dev(td11, br9);
    			append_dev(td11, t57);
    			append_dev(td11, button2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(155:0) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (242:1) {:else}
    function create_else_block(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Contacto";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 243, 2, 7390);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 244, 2, 7410);
    			attr_dev(section, "id", "contacto");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 242, 1, 7364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(242:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (232:1) {#if !lang.spanish}
    function create_if_block_1(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let div;
    	let t4;
    	let script;
    	let script_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Contact";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?";
    			t3 = space();
    			div = element("div");
    			t4 = space();
    			script = element("script");
    			attr_dev(h1, "class", "svelte-tfzw9p");
    			add_location(h1, file, 233, 2, 6557);
    			attr_dev(span, "class", "svelte-tfzw9p");
    			add_location(span, file, 234, 2, 6576);
    			attr_dev(div, "class", "calendly-inline-widget svelte-tfzw9p");
    			attr_dev(div, "data-url", "https://calendly.com/soldjinn/30min");
    			set_style(div, "min-width", "320px");
    			set_style(div, "height", "630px");
    			add_location(div, file, 236, 0, 7070);
    			attr_dev(script, "type", "text/javascript");
    			if (!src_url_equal(script.src, script_src_value = "https://assets.calendly.com/assets/external/widget.js")) attr_dev(script, "src", script_src_value);
    			script.async = true;
    			attr_dev(script, "class", "svelte-tfzw9p");
    			add_location(script, file, 237, 0, 7198);
    			attr_dev(section, "id", "contacto");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 232, 1, 6531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, span);
    			append_dev(section, t3);
    			append_dev(section, div);
    			append_dev(section, t4);
    			append_dev(section, script);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(232:1) {#if !lang.spanish}",
    		ctx
    	});

    	return block;
    }

    // (251:1) {#if showModal}
    function create_if_block(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					header: [create_header_slot],
    					default: [create_default_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("close", /*close_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(251:1) {#if showModal}",
    		ctx
    	});

    	return block;
    }

    // (252:2) <Modal on:close="{() => showModal = false}">
    function create_default_slot(ctx) {
    	let table;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t2;
    	let br0;
    	let t3;
    	let ul0;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let th2;
    	let t10;
    	let br1;
    	let t11;
    	let ul1;
    	let li3;
    	let t13;
    	let li4;
    	let t14;
    	let br2;
    	let t15;
    	let t16;
    	let th3;
    	let t17;
    	let br3;
    	let t18;
    	let ul2;
    	let li5;
    	let t20;
    	let li6;
    	let t22;
    	let tr1;
    	let td0;
    	let t24;
    	let td1;
    	let t26;
    	let td2;
    	let t28;
    	let td3;
    	let t30;
    	let tr2;
    	let td4;
    	let t32;
    	let td5;
    	let t33;
    	let br4;
    	let t34;
    	let t35;
    	let td6;
    	let t36;
    	let br5;
    	let t37;
    	let t38;
    	let td7;
    	let t39;
    	let br6;
    	let t40;
    	let t41;
    	let tr3;
    	let td8;
    	let t43;
    	let td9;
    	let t44;
    	let br7;
    	let t45;
    	let button0;
    	let t47;
    	let td10;
    	let t48;
    	let br8;
    	let t49;
    	let button1;
    	let t51;
    	let td11;
    	let t52;
    	let br9;
    	let t53;
    	let button2;

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Package";
    			t1 = space();
    			th1 = element("th");
    			t2 = text("Basic Website\n\t\t\t\t\t\t");
    			br0 = element("br");
    			t3 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "NFT Mint Engine";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "NFT Mint Function";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Responvsive 1 page website";
    			t9 = space();
    			th2 = element("th");
    			t10 = text("Standard Website\n\t\t\t\t\t\t");
    			br1 = element("br");
    			t11 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Basic included";
    			t13 = space();
    			li4 = element("li");
    			t14 = text("Artwork and Metadata generation");
    			br2 = element("br");
    			t15 = text(" from layer images you provide");
    			t16 = space();
    			th3 = element("th");
    			t17 = text("Premium Website\n\t\t\t\t\t\t");
    			br3 = element("br");
    			t18 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			li5.textContent = "Standard included";
    			t20 = space();
    			li6 = element("li");
    			li6.textContent = "Custom requests";
    			t22 = space();
    			tr1 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Revisions";
    			t24 = space();
    			td1 = element("td");
    			td1.textContent = "2";
    			t26 = space();
    			td2 = element("td");
    			td2.textContent = "5";
    			t28 = space();
    			td3 = element("td");
    			td3.textContent = "Unlimited";
    			t30 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Delivery Time";
    			t32 = space();
    			td5 = element("td");
    			t33 = text("7");
    			br4 = element("br");
    			t34 = text("8");
    			t35 = space();
    			td6 = element("td");
    			t36 = text("7");
    			br5 = element("br");
    			t37 = text("9");
    			t38 = space();
    			td7 = element("td");
    			t39 = text("7");
    			br6 = element("br");
    			t40 = text("10");
    			t41 = space();
    			tr3 = element("tr");
    			td8 = element("td");
    			td8.textContent = "Total";
    			t43 = space();
    			td9 = element("td");
    			t44 = text("$300");
    			br7 = element("br");
    			t45 = space();
    			button0 = element("button");
    			button0.textContent = "Select";
    			t47 = space();
    			td10 = element("td");
    			t48 = text("$350");
    			br8 = element("br");
    			t49 = space();
    			button1 = element("button");
    			button1.textContent = "Select";
    			t51 = space();
    			td11 = element("td");
    			t52 = text("$400");
    			br9 = element("br");
    			t53 = space();
    			button2 = element("button");
    			button2.textContent = "Select";
    			attr_dev(th0, "class", "svelte-tfzw9p");
    			add_location(th0, file, 258, 5, 8036);
    			attr_dev(br0, "class", "svelte-tfzw9p");
    			add_location(br0, file, 261, 6, 8083);
    			attr_dev(li0, "class", "svelte-tfzw9p");
    			add_location(li0, file, 263, 7, 8106);
    			attr_dev(li1, "class", "svelte-tfzw9p");
    			add_location(li1, file, 264, 7, 8138);
    			attr_dev(li2, "class", "svelte-tfzw9p");
    			add_location(li2, file, 265, 7, 8172);
    			attr_dev(ul0, "class", "svelte-tfzw9p");
    			add_location(ul0, file, 262, 6, 8094);
    			attr_dev(th1, "class", "svelte-tfzw9p");
    			add_location(th1, file, 260, 5, 8059);
    			attr_dev(br1, "class", "svelte-tfzw9p");
    			add_location(br1, file, 269, 6, 8263);
    			attr_dev(li3, "class", "svelte-tfzw9p");
    			add_location(li3, file, 271, 7, 8286);
    			attr_dev(br2, "class", "svelte-tfzw9p");
    			add_location(br2, file, 272, 42, 8352);
    			attr_dev(li4, "class", "svelte-tfzw9p");
    			add_location(li4, file, 272, 7, 8317);
    			attr_dev(ul1, "class", "svelte-tfzw9p");
    			add_location(ul1, file, 270, 6, 8274);
    			attr_dev(th2, "class", "svelte-tfzw9p");
    			add_location(th2, file, 268, 5, 8236);
    			attr_dev(br3, "class", "svelte-tfzw9p");
    			add_location(br3, file, 276, 6, 8446);
    			attr_dev(li5, "class", "svelte-tfzw9p");
    			add_location(li5, file, 278, 7, 8469);
    			attr_dev(li6, "class", "svelte-tfzw9p");
    			add_location(li6, file, 279, 7, 8503);
    			attr_dev(ul2, "class", "svelte-tfzw9p");
    			add_location(ul2, file, 277, 6, 8457);
    			attr_dev(th3, "class", "svelte-tfzw9p");
    			add_location(th3, file, 275, 5, 8420);
    			attr_dev(tr0, "class", "svelte-tfzw9p");
    			add_location(tr0, file, 257, 4, 8026);
    			attr_dev(td0, "class", "svelte-tfzw9p");
    			add_location(td0, file, 284, 5, 8575);
    			attr_dev(td1, "class", "svelte-tfzw9p");
    			add_location(td1, file, 285, 5, 8599);
    			attr_dev(td2, "class", "svelte-tfzw9p");
    			add_location(td2, file, 286, 5, 8615);
    			attr_dev(td3, "class", "svelte-tfzw9p");
    			add_location(td3, file, 287, 5, 8631);
    			attr_dev(tr1, "class", "svelte-tfzw9p");
    			add_location(tr1, file, 283, 4, 8565);
    			attr_dev(td4, "class", "svelte-tfzw9p");
    			add_location(td4, file, 290, 5, 8674);
    			attr_dev(br4, "class", "svelte-tfzw9p");
    			add_location(br4, file, 292, 7, 8714);
    			attr_dev(td5, "class", "svelte-tfzw9p");
    			add_location(td5, file, 291, 5, 8702);
    			attr_dev(br5, "class", "svelte-tfzw9p");
    			add_location(br5, file, 295, 7, 8748);
    			attr_dev(td6, "class", "svelte-tfzw9p");
    			add_location(td6, file, 294, 5, 8736);
    			attr_dev(br6, "class", "svelte-tfzw9p");
    			add_location(br6, file, 298, 7, 8782);
    			attr_dev(td7, "class", "svelte-tfzw9p");
    			add_location(td7, file, 297, 5, 8770);
    			attr_dev(tr2, "class", "svelte-tfzw9p");
    			add_location(tr2, file, 289, 4, 8664);
    			attr_dev(td8, "class", "svelte-tfzw9p");
    			add_location(td8, file, 302, 5, 8824);
    			attr_dev(br7, "class", "svelte-tfzw9p");
    			add_location(br7, file, 304, 10, 8859);
    			attr_dev(button0, "class", "svelte-tfzw9p");
    			add_location(button0, file, 305, 6, 8870);
    			attr_dev(td9, "class", "svelte-tfzw9p");
    			add_location(td9, file, 303, 5, 8844);
    			attr_dev(br8, "class", "svelte-tfzw9p");
    			add_location(br8, file, 308, 10, 8925);
    			attr_dev(button1, "class", "svelte-tfzw9p");
    			add_location(button1, file, 309, 6, 8936);
    			attr_dev(td10, "class", "svelte-tfzw9p");
    			add_location(td10, file, 307, 5, 8910);
    			attr_dev(br9, "class", "svelte-tfzw9p");
    			add_location(br9, file, 312, 10, 8991);
    			attr_dev(button2, "class", "svelte-tfzw9p");
    			add_location(button2, file, 313, 6, 9002);
    			attr_dev(td11, "class", "svelte-tfzw9p");
    			add_location(td11, file, 311, 5, 8976);
    			attr_dev(tr3, "class", "svelte-tfzw9p");
    			add_location(tr3, file, 301, 4, 8814);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-tfzw9p");
    			add_location(table, file, 256, 3, 7995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(th1, t2);
    			append_dev(th1, br0);
    			append_dev(th1, t3);
    			append_dev(th1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t5);
    			append_dev(ul0, li1);
    			append_dev(ul0, t7);
    			append_dev(ul0, li2);
    			append_dev(tr0, t9);
    			append_dev(tr0, th2);
    			append_dev(th2, t10);
    			append_dev(th2, br1);
    			append_dev(th2, t11);
    			append_dev(th2, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t13);
    			append_dev(ul1, li4);
    			append_dev(li4, t14);
    			append_dev(li4, br2);
    			append_dev(li4, t15);
    			append_dev(tr0, t16);
    			append_dev(tr0, th3);
    			append_dev(th3, t17);
    			append_dev(th3, br3);
    			append_dev(th3, t18);
    			append_dev(th3, ul2);
    			append_dev(ul2, li5);
    			append_dev(ul2, t20);
    			append_dev(ul2, li6);
    			append_dev(table, t22);
    			append_dev(table, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t24);
    			append_dev(tr1, td1);
    			append_dev(tr1, t26);
    			append_dev(tr1, td2);
    			append_dev(tr1, t28);
    			append_dev(tr1, td3);
    			append_dev(table, t30);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(tr2, t32);
    			append_dev(tr2, td5);
    			append_dev(td5, t33);
    			append_dev(td5, br4);
    			append_dev(td5, t34);
    			append_dev(tr2, t35);
    			append_dev(tr2, td6);
    			append_dev(td6, t36);
    			append_dev(td6, br5);
    			append_dev(td6, t37);
    			append_dev(tr2, t38);
    			append_dev(tr2, td7);
    			append_dev(td7, t39);
    			append_dev(td7, br6);
    			append_dev(td7, t40);
    			append_dev(table, t41);
    			append_dev(table, tr3);
    			append_dev(tr3, td8);
    			append_dev(tr3, t43);
    			append_dev(tr3, td9);
    			append_dev(td9, t44);
    			append_dev(td9, br7);
    			append_dev(td9, t45);
    			append_dev(td9, button0);
    			append_dev(tr3, t47);
    			append_dev(tr3, td10);
    			append_dev(td10, t48);
    			append_dev(td10, br8);
    			append_dev(td10, t49);
    			append_dev(td10, button1);
    			append_dev(tr3, t51);
    			append_dev(tr3, td11);
    			append_dev(td11, t52);
    			append_dev(td11, br9);
    			append_dev(td11, t53);
    			append_dev(td11, button2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(252:2) <Modal on:close=\\\"{() => showModal = false}\\\">",
    		ctx
    	});

    	return block;
    }

    // (253:3) 
    function create_header_slot(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "modal";
    			attr_dev(h2, "slot", "header");
    			attr_dev(h2, "class", "svelte-tfzw9p");
    			add_location(h2, file, 252, 3, 7953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(253:3) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let nav;
    	let ul;
    	let li;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let t1;
    	let t2;
    	let section;
    	let div1;
    	let div0;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_6;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_5;
    		return create_else_block_4;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_4;
    		return create_else_block_3;
    	}

    	let current_block_type_2 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_3;
    		return create_else_block_2;
    	}

    	let current_block_type_3 = select_block_type_3(ctx);
    	let if_block3 = current_block_type_3(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type_4 = select_block_type_4(ctx);
    	let if_block4 = current_block_type_4(ctx);

    	function select_block_type_5(ctx, dirty) {
    		if (!/*lang*/ ctx[1].spanish) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type_5 = select_block_type_5(ctx);
    	let if_block5 = current_block_type_5(ctx);
    	let if_block6 = /*showModal*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			nav = element("nav");
    			ul = element("ul");
    			li = element("li");
    			img0 = element("img");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			if_block1.c();
    			t2 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Itahand";
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "Naizir";
    			t6 = space();
    			img1 = element("img");
    			t7 = space();
    			if_block2.c();
    			t8 = space();
    			if_block3.c();
    			t9 = space();
    			if_block4.c();
    			t10 = space();
    			if_block5.c();
    			t11 = space();
    			if (if_block6) if_block6.c();
    			if (!src_url_equal(img0.src, img0_src_value = "https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "profile");
    			attr_dev(img0, "class", "profile svelte-tfzw9p");
    			add_location(img0, file, 28, 5, 544);
    			attr_dev(li, "class", "svelte-tfzw9p");
    			add_location(li, file, 27, 4, 534);
    			attr_dev(ul, "class", "list svelte-tfzw9p");
    			add_location(ul, file, 26, 3, 512);
    			attr_dev(nav, "class", "navbar svelte-tfzw9p");
    			add_location(nav, file, 25, 2, 488);
    			attr_dev(header, "class", "header svelte-tfzw9p");
    			add_location(header, file, 24, 1, 462);
    			attr_dev(span0, "class", "altH2 svelte-tfzw9p");
    			add_location(span0, file, 82, 21, 1936);
    			attr_dev(span1, "class", "svelte-tfzw9p");
    			add_location(span1, file, 82, 56, 1971);
    			attr_dev(div0, "class", "name svelte-tfzw9p");
    			add_location(div0, file, 82, 3, 1918);
    			if (!src_url_equal(img1.src, img1_src_value = "https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "profile");
    			attr_dev(img1, "class", "profile2 svelte-tfzw9p");
    			add_location(img1, file, 83, 3, 2001);
    			attr_dev(div1, "class", "svelte-tfzw9p");
    			add_location(div1, file, 81, 2, 1909);
    			attr_dev(section, "id", "about");
    			attr_dev(section, "class", "svelte-tfzw9p");
    			add_location(section, file, 79, 1, 1885);
    			attr_dev(main, "class", "svelte-tfzw9p");
    			add_location(main, file, 22, 0, 453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li);
    			append_dev(li, img0);
    			append_dev(ul, t0);
    			if_block0.m(ul, null);
    			append_dev(main, t1);
    			if_block1.m(main, null);
    			append_dev(main, t2);
    			append_dev(main, section);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t4);
    			append_dev(div0, span1);
    			append_dev(div1, t6);
    			append_dev(div1, img1);
    			append_dev(div1, t7);
    			if_block2.m(div1, null);
    			append_dev(main, t8);
    			if_block3.m(main, null);
    			append_dev(main, t9);
    			if_block4.m(main, null);
    			append_dev(main, t10);
    			if_block5.m(main, null);
    			append_dev(main, t11);
    			if (if_block6) if_block6.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(ul, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(main, t2);
    				}
    			}

    			if (current_block_type_2 !== (current_block_type_2 = select_block_type_2(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			}

    			if (current_block_type_3 !== (current_block_type_3 = select_block_type_3(ctx))) {
    				if_block3.d(1);
    				if_block3 = current_block_type_3(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(main, t9);
    				}
    			}

    			if (current_block_type_4 !== (current_block_type_4 = select_block_type_4(ctx))) {
    				if_block4.d(1);
    				if_block4 = current_block_type_4(ctx);

    				if (if_block4) {
    					if_block4.c();
    					if_block4.m(main, t10);
    				}
    			}

    			if (current_block_type_5 !== (current_block_type_5 = select_block_type_5(ctx))) {
    				if_block5.d(1);
    				if_block5 = current_block_type_5(ctx);

    				if (if_block5) {
    					if_block5.c();
    					if_block5.m(main, t11);
    				}
    			}

    			if (/*showModal*/ ctx[0]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*showModal*/ 1) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(main, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block6);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block6);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			if_block3.d();
    			if_block4.d();
    			if_block5.d();
    			if (if_block6) if_block6.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let showModal = false;

    	const scrollToElement = selector => {
    		const elemento = document.querySelector(selector);
    		if (!elemento) return;
    		let posicion = elemento.getBoundingClientRect().top;
    		let offset = posicion + window.pageYOffset;
    		window.scrollTo({ top: offset, behavior: 'smooth' });
    	};

    	let lang = { spanish: false };

    	function toggle() {
    		$$invalidate(1, lang.spanish = !lang.spanish, lang);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => scrollToElement('#about');
    	const click_handler_1 = () => scrollToElement('#portafolio');
    	const click_handler_2 = () => scrollToElement('#portafolio');
    	const click_handler_3 = () => $$invalidate(0, showModal = true);
    	const click_handler_4 = () => scrollToElement('#about');
    	const click_handler_5 = () => scrollToElement('#portafolio');
    	const click_handler_6 = () => scrollToElement('#servicios');
    	const click_handler_7 = () => scrollToElement('#portafolio');
    	const close_handler = () => $$invalidate(0, showModal = false);

    	$$self.$capture_state = () => ({
    		Modal,
    		showModal,
    		scrollToElement,
    		lang,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('lang' in $$props) $$invalidate(1, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showModal,
    		lang,
    		scrollToElement,
    		toggle,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		close_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
