<script>
	export let spanish = true;
</script>

<main>
	<header class="header">
		<nav class="navbar">
			<ul class="list">
				<li>
					<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile">
				</li>
				<li>About</li>
				<li>Experience</li>
				<li>Education</li>
				<li>Skills</li>
				<li>Portfolio</li>
				<li>Interests</li>
			</ul>
		</nav>
	</header>
	<section>
		<div>
			<h1>Itahand Naizir</h1>
			<p>4746 E 8th Street, Tulsa OK. - +1 (305) 713-8713 - Itahand.naizir@gmail.com</p>
			<p>I am experienced in leveraging agile frameworks, well-versed in the landscape of Blockchain technology and providing Web3 services.<br> My passion for blockchain comes from creating applications that deliver transparency, security and increased efficiency in finance.</p>
		</div>
	</section>
	<section>
		HELLO WORLD
	</section>
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
		font-size: 36px;
	}
	section {
		height: 100vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
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

	.navbar {
		position: relative;
		z-index: -10;
	}
	.profile {
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 2px solid white;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
		section {
		padding-left: 250px;
		}
		.header {
		display: block;
		position: fixed;
		background: palevioletred;
		height: 100%;
		width: 250px;
	}
	}
</style>