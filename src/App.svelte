<script>
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
				<li>About</li>
				<li>Services</li>
				<li>Portfolio</li>
				<button on:click={toggle}>Español</button>
				{:else}
				<li>Introdución</li>
				<li>Servicios</li>
				<li>Portafolio</li>
				<button on:click={toggle}>English</button>
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
	<section>
		<div class="intro">
			<div class="name"><span class="altH2">Itahand</span> <span class="altH1"> Naizir</span></div>
			<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile2">
			<p class="info">Tulsa, OK, United States - +1 (305) 713-8713 - Itahand.naizir<span class="alts">@gmail.com</span></p>

			{#if !lang.spanish}
			<p>
				I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Developement with a focus on usability. My passion for blockchain comes from creating applications that deliver transparency, security and increased efficiency in finance.
			</p>
			{:else}
			<p>
				Tengo experiencia trabajando en ambientes ágiles y poseo una pasión innata por la tecnología blockchain. Me especializo en smart contracts que cumplen los standards y poseen un valor de utilidad, especialmente en el espacio DeFi. Mi pasion por esta tecnología nace de crear aplicaciones que aseguran transparencia, seguridad y mayor eficiencia en finanzas.
			</p>
			{/if}
		</div>

	</section>
{#if !lang.spanish}
	<section>
		<div class="services">
			<h3><span class="altH2">Services</span></h3>
		</div>
		<div class="services">
			<h1><span class="altH1">What I can do</span></h1>
		</div>
		<div class="services2">
			<div>
					<h2>BLOCKCHAIN</h2>
					<div>
						I design, develop and integrate Smart Contracts, token deployment and NFTs functionalities with decentralized or commercial applications that seek to work under a safe environment.
					</div>
			</div>
			<div>
					<h2>WEB DEVELOPMENT</h2>
					<div>
								I am a fullstack developer proficient with Svelte, React, Angular, Node.js and databases.
					</div>
			</div>
		</div>
	</section>
	{:else}
	<section>
		<div class="services">
			<h3><span class="altH2">Servicios</span></h3>
		</div>
		<div class="services">
			<h1><span class="altH1">Lo que puedo hacer</span></h1>
		</div>
		<div class="services2">
			<div>
					<h2>BLOCKCHAIN</h2>
					<div>
						Diseño e integración de aplicaciones blockchain personalizadas en sistemas empresariales existentes para que las empresas aprovechen un entorno seguro para múltiples transacciones comerciales.
					</div>
			</div>
			<div>
					<h2>WEB DEVELOPMENT</h2>
					<div>
								Soy un dessarrollador fullstack; me manejo con proeficiencia usando Svelte, React, Angular, Node.js y bases de datos.
					</div>
			</div>
		</div>
	</section>
	{/if}

	{#if !lang.spanish}
	<section>
		<div class="portfolio">
			<span class="altH1">Portfolio</span>
			<div class="portGrid">
				<div class="card">
					<a href="itahandexchange.on.fleek.co" target="none" >
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					<br>
						Cryptocurrency Exchange
					</a>
				</div>
			</div>
		</div>
	</section>
	{:else}
	<section>
		<div class="portfolio">
			<span class="altH1">Portafolio</span>
			<div class="portGrid">
				<div class="card">
					<a href="itahandexchange.on.fleek.co" target="none" >
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					<br>
						Casa de cambio de Criptomonedas.
					</a>
				</div>
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
	.alts {
		color: #ff3e00;
	}
	.altH1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-weight: 100;
		font-size: 46px;
	}
	.altH2 {
		color: black;
		text-transform: uppercase;
		font-weight: 100;
		font-size: 46px;
	}
	section {
		height: 80vh;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 85vw;
		margin: auto;
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
	.profile, .profile2 {
		height: 150px;
		width: 150px;
		border-radius: 50%;
		border: 3px solid wheat;
	}
	.info {
		font-size: 20px;
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
		display: flex;
		justify-content: center;
	}
	.exchange {
		width: 350px;
		padding: 1rem;
		margin: 1rem auto;
		border: 1.5px dotted black;
		cursor: pointer;
	}
	.idioma {
		background: transparent;
		transition: ease-in-out 200ms;
		border-radius: 15%;
		border: 2px solid wheat;
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
		.intro {
			text-align: left;
			padding-left: 1rem;
		}
		.altH1, .altH2 {
			font-size: 100px;
		}
		.altH1 {
			border-bottom-color: black;
			border-bottom-style: inset;
		}
		.info {
			margin-top: 5rem;
		}
		.services {
			margin-bottom: 2.5rem;
		}
		.services .altH1 {
			font-size: 4rem;
		}
		.services .altH2 {
			font-size: 2.5rem;
			border-bottom: none;
			margin-bottom: 10rem;
		}
		.services2 {
			flex-direction: row;
		}
		.portfolio .altH1 {
			border-bottom: none;
		}
	}
</style>
