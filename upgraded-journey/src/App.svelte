<script>
	export let names = 'Itahand Naizir';
</script>

<main>
	<header class="header">
		<nav class="navbar">
			<ul>
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

	.header {
		position: fixed;
		background: palevioletred;
		height: 100%;
		width: 250px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.header ul {
		padding: 1rem;
		list-style: none;
	}
	.navbar {
		position: relative;
	}
	.profile {
		height: 150px;
		width: 150px;
		border-radius: 50%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>