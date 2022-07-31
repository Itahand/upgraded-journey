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
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#servicios')}>Services</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Portfolio</a>
				</li>
				<button on:click={toggle}>Español</button>
				<div id="faucet">
					<h3 style="color: wheat; border-bottom: 1px dotted white" >NOAH Faucet</h3>
					<input type="checkbox" id="toggle" class="toggle__checkbox" />
					<aside class="box">
						<label for="toggle" class="toggle"><i class="icon"></i></label>
						<div class="pasteAdd">
							<h1 style="--index:1;" class="box__item">Paste Address</h1>
							<input style="--index:3;" class="box__item" placeholder="Kovan Address (soon)">
						</div>
					</aside>
				</div>


				{:else}

				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#about')}>Introdución</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#servicios')}>Servicios</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Portafolio</a>
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
		<div class="intro">
			<div class="name"><span class="altH2">Itahand</span> <span class="altH1"> Naizir</span></div>
			<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile2">
			<p class="info">Tulsa, OK, United States - +1 (305) 713-8713 - Itahand.naizir<span class="alts">@gmail.com</span></p>

			{#if !lang.spanish}
			<p class="introd">
				I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Development with a focus on usability. My passion for blockchain comes from creating applications that deliver transparency, security and increased efficiency in finance.
			</p>

			{:else}

			<p class="introd">
				Tengo experiencia trabajando en ambientes ágiles y poseo una pasión innata por la tecnología blockchain. Me especializo en smart contracts que cumplen los standards y poseen un valor de utilidad, especialmente en el espacio DeFi. Mi pasion por esta tecnología nace de crear aplicaciones que aseguran transparencia, seguridad y mayor eficiencia en finanzas.
			</p>
			{/if}

	</section>
{#if !lang.spanish}
	<section id="servicios">
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

	<section id="servicios">
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
	<section id="portafolio">
		<div class="portfolio">
			<span class="altH1">Portfolio</span>
			<div class="portGrid">
				<div class="card">
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					<br>
						Cryptocurrency Exchange
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
					<a href="https://itahandexchange.on.fleek.co/" target="none" >
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
	:root {
  --easing: cubic-bezier(0.33, 1, 0.68, 1);
  --easing-2: cubic-bezier(0.61, 1, 0.88, 1);
	}
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
	.introd {
		width: 75%;
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

	#faucet {
		margin-top: 10vh;
	}
	input[type=checkbox]:checked + .box:after {
		transform: translate(45%) scale3d(1, 8, 1);
    width: 100%;
	}
	input[type=checkbox]:checked + .box .box__item {
		transform: translateX(0px);
  opacity: 1;
  visibility: visible;
  transition: all 0.5s ease-out;
  transition-delay: calc(var(--index) * 0.1s);
  transition-property: transform, opacity;

}
	input[type=checkbox]:checked + .box .icon {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E %3Cpath d='M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z'/%3E %3C/svg%3E ");
}

	.box {
	margin-top: 1.5rem;
  padding-top: 1rem;
  position: relative;
}
	.box:after {
  content: "";
  width: 40px;
  height: 35px;
  position: absolute;
  right: 45%;
  top: 50%;
  transform-origin: 100% 50%;
  transform: translateY(135%);
  transition: transform 0.3s var(--easing);
  z-index: -1;
}
	.box__item {
  visibility: hidden;
  transform: translateX(20px);
  opacity: 0;
  transition: opacity 0.2s var(--easing-2) 0;
}

	.toggle {
  display: block;
  position: absolute;
  right: 40%;
  top: 50%;
  transform: translateY(-150%);
}
	.toggle__checkbox {
  display: none;
}

	.icon {
  cursor: pointer;
  display: block;
  width: 50px;
  height: 50px;
  background: no-repeat center/40%;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-clock'%3E %3Ccircle cx='12' cy='12' r='10'/%3E %3Cpath d='M12 6v6l4 2'/%3E %3C/svg%3E ");
}
*,
*:before,
*:after {
  box-sizing: border-box;
}

</style>
