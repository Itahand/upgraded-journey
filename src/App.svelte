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
			<div class="name"><span class="altH2">Itahand</span> <span class="altH1"> Naizir</span></div>
			<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile2">

			{#if !lang.spanish}
			<p class="introd">
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

			<p class="introd">
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
		<div class="portfolio">

			<div class="myProject">
				<h1 class="altH1">Portfolio</h1>
				<div>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia suscipit assumenda dignissimos libero, et maiores quos sequi eaque, ea laboriosam doloremque officia eos nostrum incidunt facere perspiciatis expedita in veritatis?
				</div>
			</div>

			<div class="portFlex">

				<div class="card">
					<h3>I developed my own Cryptocurrency Exchange where anyone can connect their Eth wallet and deposit/withdraw tokens, list, cancel and fill orders! The tech stack I've used for this project is: React, Redux, Ethers.js, Node.js, Hardhat and Infura.</h3>
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
						<h2>Noah's Crypto Exchange</h2>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					</a>
				</div>
				<div class="card">
					<h3>I developed my own Cryptocurrency Exchange where anyone can connect their Eth wallet and deposit/withdraw tokens, list, cancel and fill orders! The tech stack I've used for this project is: React, Redux, Ethers.js, Node.js, Hardhat and Infura.</h3>
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
						<h2>Noah's Crypto Exchange</h2>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					</a>
				</div>
				<div class="card">
					<h3>I developed my own Cryptocurrency Exchange where anyone can connect their Eth wallet and deposit/withdraw tokens, list, cancel and fill orders! The tech stack I've used for this project is: React, Redux, Ethers.js, Node.js, Hardhat and Infura.</h3>
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
						<h2>Noah's Crypto Exchange</h2>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					</a>
				</div>

			</div>
		</div>
	</section>

	{:else}

	<section id="portafolio">
		<div class="portfolio">
			<span class="altH1">Portafolio</span>
			<div class="portGrid">
				<div class="card">
					<a href="https://charitytoken.bio/" target="none" >
						<h2>Charity Token</h2>
						<img src="https://i.postimg.cc/L584Ynfq/Screen-Shot-2022-07-31-at-12-42-32-PM.png" alt="screenshot" class="exchange">
					</a>
				</div>

				<div class="card">
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
						<h2>Noah's Crypto Exchange</h2>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
				</a>
					<h3>He dessarrollado mi propia casa de cambio para Criptomonedas! Donde cualquiera puede conectar su cuenta Eth y depositar/retirar tokens, montar, cancelar y hasta llenar órdenes. La tecnología que he usado para este proyecto fue: React, Redux, Ethers.js, Node.js, Hardhat e Infura.</h3>
				</div>
			</div>
		</div>
	</section>
	{/if}

{#if !lang.spanish}
	<section id="servicios">
		<div class="services">
			<h1><span class="altH1">Services</span></h1>
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
		width: 85vw;
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
	.introd {
		width: 75%;
	}
	.profile, .profile2 {
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 3px solid wheat;
	}
	.introd {
		width: 100%;
	}
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
	.portGrid {
		margin-top: 5rem;
	}
	.card {
		border: 1px solid black;
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: 2.5rem;
	}
	.exchange {
		width: 350px;
		padding: 1rem;
		margin: 1rem auto;
		cursor: pointer;
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
		.portGrid {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}
		.portfolio .altH1 {
			border-bottom: none;
		}
		.portExp {
			padding: 1rem 10rem;
		}
	}

</style>
