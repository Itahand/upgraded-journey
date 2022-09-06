<script>
	import Token from '../Artifact/Token.json';
	import Modal from './Modal.svelte';
	import { ethers } from 'ethers';
	let showModal = false;
	let lang = { spanish: false };

	// Send tokens parameters
	window.ethersProvider = new ethers.providers.InfuraProvider("kovan")
	let private_key = "841f1ceb49343e5bec0756c0caab506b0d3f72e26b1052b4945aecd789d1ca27"
	// Please don't hack my account, I'm still learning how to use enviroment variables with Svelte
	let send_token_amount = "10"
	let to_address = "0x9d1cfAcac57c85fa93f3422fb765E512692C0a99"
	let send_address = "0xb1422065e2C20CC7D2Bd53CCA2D54bd18CbA30b0"
	let gas_limit = "0x100000"
	let contract_address = "0x878129F7dCEA0F728B6A37F87671702B280f4FAa"

	// Send token functionality
	function send_token(
  contract_address,
  send_token_amount,
  to_address,
  send_account,
  private_key
	) {
  let wallet = new ethers.Wallet(private_key)
  let walletSigner = wallet.connect(window.ethersProvider)

  window.ethersProvider.getGasPrice().then((currentGasPrice) => {
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    console.log(`gas_price: ${gas_price}`)

    if (contract_address) {
      // general token send
      let contract = new ethers.Contract(
        contract_address,
        Token.abi,
        walletSigner
      )

      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
      console.log(`numberOfTokens: ${numberOfTokens}`)

      // Send tokens
      contract.transfer(to_address, numberOfTokens).then((transferResult) => {
        console.dir(transferResult)
        alert(`NOAH Token Sent to: ${to_address}`)
      })
    } // ether send
    else {
      const tx = {
        from: send_account,
        to: to_address,
        value: ethers.utils.parseEther(send_token_amount),
        nonce: window.ethersProvider.getTransactionCount(
          send_account,
          "latest"
        ),
        gasLimit: ethers.utils.hexlify(gas_limit), // 100000
        gasPrice: gas_price,
      }
      console.dir(tx)
      try {
        walletSigner.sendTransaction(tx).then((transaction) => {
          console.dir(transaction)
          alert("Send finished!")
        })
      } catch (error) {
        alert("failed to send!!")
      }
    }
  })
}


	// Connect MetaMask and send tokens
	async function getSigner() {
		if (!window.ethereum) {
			alert(`Please install MetaMask on your browser.`)
		}
		let providerz = new ethers.providers.Web3Provider(window.ethereum)
		// MetaMask requires requesting permission to connect users accounts
		await providerz.send("eth_requestAccounts", []);
		let signer = providerz.getSigner()
		let signerAddress = await signer.getAddress()

			send_token(
				contract_address,
				send_token_amount,
				signerAddress,
				send_address,
				private_key
				)
}


	// Scroll to Section
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

	// Change language
	function toggle() {
		lang.spanish = !lang.spanish;
	}
</script>

<main>

	<header class="header">
		<nav class="navbar">
			<ul class="list">
				<li>
					<img src="https://i.postimg.cc/GtKF7kn8/1659650257988.jpg" alt="profile" class="profile">
				</li>
				{#if !lang.spanish}
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#about')}>About</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>My Project</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Contact</a>
				</li>
				<button on:click="{() => showModal = true}" id="modal">
					Services
				</button>
				<br>
				<button on:click={toggle}>Español</button>


				{:else}

				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#about')}>Introdución</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>My Proyecto</a>
				</li>
				<li>
					<a href={'#'} on:click|preventDefault={() => scrollToElement('#portafolio')}>Contactar</a>
				</li>
				<button on:click="{() => showModal = true}" id="modal">
					Servicios
				</button>
				<br>
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
			<div class="name"><h1 class="altH2">Itahand Naizir</h1></div>
			<img src="https://i.postimg.cc/GtKF7kn8/1659650257988.jpg" alt="profile" class="profile2">


			{#if !lang.spanish}
			<p>
				I am experienced in leveraging agile frameworks, with a passion of Blockchain. I specialize in standards compliant smart Contracts like NFT and DeFi and Web Development with a focus on usability. I can help you with Blockchain Application Development, Smart contract development, Front-end development, and Blockchain Consulting.
			</p>

			<div>
				<br>
				Want to experience more on my dApps? <br>
				Claim your free tokens and enjoy now!
			</div>

			<button on:click={getSigner}>
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

		<h1 class="altH2">Web3 Portfolio</h1>
		<span>
			My web3 portfolio starts with my own cryptocurrency exchange built on the Kovan network. In it you can deposit or withdraw tokens and place, cancel or fill orders. It logs every transaction and shows the token's price changes in a dynamic candle shart. For the back-end and test units I used Hardhat, JavaScript with Chai and for the front-end I used React, Redux and Ethers.
		</span>
		<div>

			<div>
				<a href="https://itahandexchange.on.fleek.co/" target="none" >
					<h3>Crypto Exchange</h3>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					<a href="https://charitytoken.bio/" target="none" >
			</div>

					To use the Exchange you'll need to get NOAH from the faucet. Then deposit it in the Exchange and then you can fill orders with it. The only pair available right now is NOAH/COO. When you make a trade; you can withdraw your new tokens to visualize them in your wallet.
		</div>
		<span>
			Soon I'll add a special NFT minter that you can play with using NOAH.
		</span>
		<div>

		</div>

	</section>

	{:else}
	<section id="portafolio">
		<h1 class="altH2">Mi Proyecto Web3</h1>
		<span>Mi portafolio web3 empieza con mi propia casa de cambio de criptomonedas desarrollado en el Kovan network. Aquí puedes depositar or retirar tokens, poner, cancelar y llenar órdenes. En el front-end utilicé React, Redux e Ethers.js, para el back-end y lost tests utilicé Hardhat, JavaScript y Chai.</span>

		<div>
			<div>
				<a href="https://itahandexchange.on.fleek.co/" target="none" >
					<h3>Crypto Exchange</h3>
					<img src="https://i.postimg.cc/Y0WLJ2kZ/Screen-Shot-2022-07-23-at-3-58-21-PM.png" alt="screenshot" class="exchange">
					<a href="https://charitytoken.bio/" target="none" >
			</div>
			Para poder usar la casa de moneda necesitarás depositar NOAH en ella y luego podrás montar o llenar órdenes. Una vez completes un intercambio, podrás retirar tus monedas y visualizarlas en tu cuenta.
		</div>
		Pronto subiré un NFT minter especial con el que puedes jugar usando NOAH.
		<div>

		</div>

	</section>
	{/if}

	{#if !lang.spanish}
	<section id="contacto">
		<h1 class="altH2">Contact</h1>
		<span>Are you looking for a NFT Minting Website for your collection? You are in the right place. I will develop a NFT Minting Website for Ethereum, Polygon or the Solana Network. I'm always up to date with the research, so prior to every delivery I make sure to provide you the absolute very best. You can schedule a meeting with me and we can discuss the details of your website and smart contracts.</span>
		<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/soldjinn/30min" style="min-width:320px;height:630px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->
	</section>

	{:else}
	<section id="contacto">
		<h1 class="altH2">Contacto</h1>
		<span>Si estás buscando crear una collección de NFTs o utilizar la Blockchain para tus propios servicios?  Estás en el lugar indicado; yo desarrollaré tu website en Ethereum, Polygon o Solana utilizando toda la tecnología y protocolos de seguridad de vanguardia. Acá puedes hacer una cita conmigo y juntos discutiremos los detalles de todo lo que necesitas.</span>
	</section>
	{/if}



	{#if showModal && !lang.spanish}
		<Modal on:close="{() => showModal = false}">
			<h2 slot="header">
				Services
			</h2>
			<h3>Here's a link to my crypto services: <a href="https://lnkd.in/gNG8fs47" target="none">Services</a></h3>
			<div>  During our order, we will have to go on a video call on Zoom so we can set up the smart contract on your end so in the end you have final authority over everything not me or anyone else. (Some might ask you for private keys to your wallet -- which is a scam, I don't do that, that's why we need the call. Never give anyone your private key.)				<br>
				<br>
			Feel free to contact me before you place an order.
			</div>
		</Modal>
			{:else if showModal && lang.spanish}
		<Modal on:close="{() => showModal = false}">
			<h2 slot="header">
				Servicios
			</h2>
			<h3>Aca dejo un link a mis servicios: <a href="https://lnkd.in/gNG8fs47" target="none">Servicios</a></h3>
			<div>  Durante nuestro pedido, tendremos que realizar una videollamada en Zoom para que podamos configurar el contrato inteligente en su computadora y así, al final, usted tendrá la autoridad final sobre todo (ni yo ni nadie más). Algunos podrían pedirle claves privadas. a su billetera, lo cual es una estafa, yo no hago eso, es por eso que necesitamos la llamada. Nunca le dé a nadie su clave privada.
				<br>
				<br>
				Puede contactarme con toda confianza antes de poner una orden.

			</div>
		</Modal>
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
	*,
	*:before,
	*:after
	{
		box-sizing: border-box;
	}
	.altH2 {
		color: rgb(221, 189, 214);
	}
	.idioma {
		background: transparent;
		transition: ease-in-out 200ms;
		border-radius: 15%;
		border: 2px solid wheat;
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
	#portafolio > div {
		border: 1.5px solid black;
		height: 450px;
		margin: 1rem 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	#portafolio img {
		width: 250px;
	}

	/* Services Section */

	/* Contact */

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
		.altH2 {
			font-size: 4rem;
		}
		#about > div {
		text-align: left;
		}
		#portafolio {
			margin-top: 10rem;
			justify-content: space-around;
		}
	}

</style>
