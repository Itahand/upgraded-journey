<script>
	export let names = 'Itahand Naizir';
</script>

<header class="navbar">
	<nav>
		<ul>
			<li>
				Profile Picture
			</li>
			<li>
				About
			</li>
			<li>
				Experience
			</li>
		</ul>
	</nav>
</header>
<main>
	<h1>Hello {names}! </h1>

</main>

<style>
	main {
		text-align: center;
		padding: 0;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-weight: 100;
	}

	.navbar {
		position: fixed;
		background: palevioletred;
		height: 100%;
		width: 200px;
	}
	.navbar ul {
		padding: 1rem;
		list-style: none;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>