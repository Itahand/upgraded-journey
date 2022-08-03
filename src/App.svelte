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
        alert("sent token")
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
		let providerz = new ethers.providers.Web3Provider(window.ethereum)
		// MetaMask requires requesting permission to connect users accounts
		await providerz.send("eth_requestAccounts", []);

		send_token(
			contract_address,
			send_token_amount,
			to_address,
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
		<div>

		</div>
		<div>

		</div>
		<div>

		</div>
	</section>
	{/if}

	{#if !lang.spanish}
	<section id="contacto">
		<h1>Contact</h1>
		<span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?</span>
		<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/soldjinn/30min" style="min-width:320px;height:630px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->
	</section>

	{:else}
	<section id="contacto">
		<h1>Contacto</h1>
		<span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quas quo dolores voluptatibus animi harum deleniti nihil pariatur, ex sapiente molestiae officiis ipsa facere eaque blanditiis at, quae commodi Lorem Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem itaque dicta, dolore harum, exercitationem unde, voluptatem facere sequi facilis inventore quaerat pariatur. Animi debitis eaque quidem cum, reiciendis sequi nam?</span>
	</section>
	{/if}



	{#if showModal}
		<Modal on:close="{() => showModal = false}">
			<h2 slot="header">
				Services
			</h2>

			<table style="width:100%">
				<tr>
					<th>Package</th>

					<th>Basic Website
						<br>
						<ul>
							<li>NFT Mint Engine</li>
							<li>NFT Mint Function</li>
							<li>Responvsive 1 page website</li>
						</ul>
					</th>
					<th>Standard Website
						<br>
						<ul>
							<li>Basic included</li>
							<li>Artwork and Metadata generation<br> from layer images you provide</li>
						</ul>
					</th>
					<th>Premium Website
						<br>
						<ul>
							<li>Standard included</li>
							<li>Custom requests</li>
						</ul>
					</th>
				</tr>
				<tr>
					<td>Revisions</td>
					<td>2</td>
					<td>5</td>
					<td>Unlimited</td>
				</tr>
				<tr>
					<td>Delivery Time</td>
					<td>
						7<br>8
					</td>
					<td>
						7<br>9
					</td>
					<td>
						7<br>10
					</td>
				</tr>
				<tr>
					<td>Total</td>
					<td>
						$300<br>
						<button>Select</button>
					</td>
					<td>
						$350<br>
						<button>Select</button>
					</td>
					<td>
						$400<br>
						<button>Select</button>
					</td>
				</tr>
			</table>

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
	#portafolio div {
		border: 1.5px solid black;
		height: 250px;
		margin: 1rem 0;
	}

	/* Services Section */

	table, th, td {
  border:1px solid black;
	text-align: center;
	}
	#servicios {
		display: flex;
		flex-direction: column;
	}
	#servicios table {
		margin: 5rem auto;
	}

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
		#about > div {
		text-align: left;
		}
		#portafolio {
			margin-top: 10rem;
			justify-content: space-around;
		}
	}

</style>
