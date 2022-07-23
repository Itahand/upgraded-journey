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
				<li>Services</li>
				<li>Portfolio</li>
			</ul>
		</nav>
	</header>
	<section>
		<div class="intro">
			<div class="name"><span class="altH2">Itahand</span> <span class="altH1"> Naizir</span></div>
			<img src="https://i.postimg.cc/Y0gQ47Lt/profile-pic.jpg" alt="profile" class="profile2">
			<p class="info">Tulsa, OK, United States - +1 (305) 713-8713 - Itahand.naizir<span class="alts">@gmail.com</span></p>
			<p>I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Developement with a focus on usability. <br> My passion for blockchain comes from creating applications that deliver transparency, security and increased efficiency in finance.</p>
		</div>
	</section>
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
						Developing Smart Contracts, decentralized exchanges, token deployment and NFTs functionalities.
					</div>
			</div>
			<div>
					<h2>WEB DEVELOPMENT</h2>
					<div>
								I am proficient with Svelte, React, Angular, Node.js and databases.
					</div>
			</div>
		</div>
	</section>
	<section>
		<div class="portfolio">
			<span class="altH1">Portfolio</span>
			<div class="portGrid">
				<div class="card">
					<a href="https://late-field-5240.on.fleek.co/" target="none" class="exchange">Cryptocurrency Exchange</a>
				</div>
			</div>
		</div>
	</section>
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
		width: 50%;
		margin: auto;
	}
	.portGrid {
		margin-top: 5rem;
	}
	.exchange {
		border: 1.5px solid black;
		padding: 1rem;
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
		.profile2 {
			display: none;
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
