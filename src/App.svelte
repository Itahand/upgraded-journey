<script>

	const scrollToElement = (selector) => {
	const elemento = document.querySelector(selector);
	if (!elemento) return;

	let posicion = elemento.getBoundingClientRect().top;
	let offset = posicion + window.pageYOffset;

	window.scrollTo({
		top: offset,
		behavior: 'smooth',
	});
	};

	let lang = { spanish: false };
	function toggle() {
		lang.spanish = !lang.spanish;
	}
</script>

<main>

	<header class="header">
		<nav class="navbar">
			<ul class="list">
				<li>
					<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile">
				</li>
				{#if !lang.spanish}
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#about')}>About</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>My Project</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#servicios')}>Services</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Contact</a>
				</li>
				<button on:click={toggle}>Español</button>


				{:else}

				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#about')}>Introdución</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>My Proyecto</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#servicios')}>Servicios</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Contactar</a>
				</li>
				<button on:click={toggle}>
					English
				</button>
				{/if}
			</ul>
		</nav>
	</header>

	{#if !lang.spanish}
	<button on:click={toggle} class="idioma">
		Español
	</button>
	{:else}
	<button on:click={toggle} class="idioma">
		English
	</button>
	{/if}

	<section id="about">

		<div>
			<div class="name"><span class="altH2">Itahand</span> <span> Naizir</span></div>
			<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile2">

			{#if !lang.spanish}
			<p>
				I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Development with a focus on usability. I can help you with Blockchain Application Development, Smart contract development, Front-end development, and Blockchain Consulting.
			</p>

			<div>
				<br>
				Want to experience more on my dApps? <br>
				Claim your free tokens and enjoy now!
			</div>

			<button>
				Free NOAH token
			</button>

			{:else}

			<p>
				Tengo experiencia trabajando en ambientes ágiles y poseo una pasión innata por la tecnología blockchain. Me especializo en smart contracts que cumplen los standards y poseen un valor de utilidad, especialmente en el espacio DeFi. Yo te puedo ayudar con desarrollo de dApps, con desarrollo de Smart Contracts, con desarrollo de Front-end más integración a Blockchain, y accesoría en Blockchain.
			</p>

			<div>
				<br>
				Quieres experimentar con mis dApps? <br>
				Reclama tus tokens y disfruta ahora mismo!
			</div>

			<button>
				Reclama NOAH gratis
			</button>
			{/if}

	</section>

	{#if !lang.spanish}

	<section id="portafolio">
		<h1>My Project</h1>
		<span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?</span>
		<div>

		</div>
		<div>

		</div>
		<div>

		</div>
	</section>

	{:else}

	<section id="portafolio">
		<h1>Mi Proyecto</h1>
		<span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?</span>
	</section>
	{/if}

{#if !lang.spanish}
	<section id="servicios">
		<div class="services">
			<h1><span>Services</span></h1>
		</div>
		<div class="services2">
			<div>

			</div>
			<div>

			</div>
		</div>
	</section>

	{:else}

	<section id="servicios">
		<div class="services">
			<h3><span class="altH2">Servicios</span></h3>
		</div>
		<div class="services2">
			<div>

			</div>
			<div>

			</div>
		</div>
	</section>
	{/if}

</main>

<style>
	main {
		text-align: center;
		padding: 0;
		line-height: 1.3rem;
	}
	section {
		height: 100vh;
		width: 75vw;
		margin: auto;
		text-align: left;
	}
	.header {
		display: none;
	}
	.list {
		padding: 1rem;
		list-style: none;
	}
	.list li {
		margin: 1rem 0;
		color: white;
	}
	.list a {
		color: white;
	}
	.list button {
		cursor: pointer;
		background: transparent;
		color: white;
		border: 1.5px solid wheat;
		transition: ease-in-out 300ms;
	}
	.list button:hover {
		border: 2px solid black;
	}
	.navbar {
		position: relative;
		z-index: -10;
	}

	/* Intro Section */

	#about {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	#about > div {
		text-align: center;
	}
	.profile, .profile2 {
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 3px solid wheat;
	}

	/* Portfolio Section */

	#portafolio {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	#portafolio div {
		border: 1.5px solid black;
		height: 250px;
	}

	/* Services Section */

	.services2 {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
	}
	.services2 div {
		width: 100%;
	}
	.services2 div div {
		width: 75%;
		margin: auto;
	}
	.idioma {
		background: transparent;
		transition: ease-in-out 200ms;
		border-radius: 15%;
		border: 2px solid wheat;
	}
	*,
	*:before,
	*:after
	{
		box-sizing: border-box;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
		section {
			padding-left: 250px;
		}
		.profile2, .idioma {
			display: none;
		}
		.header {
			display: block;
			position: fixed;
			background: palevioletred;
			height: 100%;
			width: 250px;
		}
		#about > div {
		text-align: left;
		}
		.introd {
			width: 75%;
		}
		.services {
			margin-bottom: 2.5rem;
		}
		.services2 {
			flex-direction: row;
		}
		#portafolio {
			margin-top: 10rem;
		}
	}

</style>
