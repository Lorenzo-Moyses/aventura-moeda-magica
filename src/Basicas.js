import { validate } from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

export class Ferramenta {
	#nome;

	constructor(nome) {
		validate(nome, "String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}

	usar() {
		return true;
	}
}

export class Mochila {
	#ferramentas;
	#capacidadeMaxima;

	constructor(capacidade = 3) {
		this.#ferramentas = [];
		this.#capacidadeMaxima = capacidade;
	}

	guarda(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (this.#ferramentas.length >= this.#capacidadeMaxima) {
			console.log("Sua mochila está cheia. Descarte algo antes de pegar outro item.");
			return false;
		}
		this.#ferramentas.push(ferramenta);
		return true;
	}

	descarta(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		const index = this.#ferramentas.findIndex(f => f.nome === nomeFerramenta);
		if (index !== -1) {
			this.#ferramentas.splice(index, 1);
			console.log(`${nomeFerramenta} descartado(a) da mochila.`);
			return true;
		} else {
			console.log(`${nomeFerramenta} não está na mochila.`);
			return false;
		}
	}

	pega(nomeFerramenta) {
		validate(arguments, ["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	tem(nomeFerramenta) {
		validate(arguments, ["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	inventario() {
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}
}

export class Objeto {
	#nome;
	#descricaoAntesAcao;
	#descricaoDepoisAcao;
	#acaoOk;

	constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments, ["String", "String", "String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		this.#acaoOk = false;
	}

	get nome() {
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk, "Boolean");
		this.#acaoOk = acaoOk;
	}

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		} else {
			return this.#descricaoDepoisAcao;
		}
	}

	usa(ferramenta, objeto) {}
}

export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;

	constructor(nome, engine) {
		validate(arguments, ["String", Engine]);
		this.#nome = nome;
		this.#objetos = new Map();
		this.#ferramentas = new Map();
		this.#portas = new Map();
		this.#engine = engine;
	}

	get nome() {
		return this.#nome;
	}

	get objetos() {
		return this.#objetos;
	}

	get ferramentas() {
		return this.#ferramentas;
	}

	get portas() {
		return this.#portas;
	}

	get engine() {
		return this.#engine;
	}

	objetosDisponiveis() {
		let arrObjs = [...this.#objetos.values()];
		return arrObjs.map(obj => obj.nome + ":" + obj.descricao);
	}

	ferramentasDisponiveis() {
		let arrFer = [...this.#ferramentas.values()];
		return arrFer.map(f => f.nome);
	}

	portasDisponiveis() {
		let arrPortas = [...this.#portas.values()];
		return arrPortas.map(sala => sala.nome);
	}

	pega(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		let ferramenta = this.#ferramentas.get(nomeFerramenta);
		if (ferramenta != null) {
			const guardou = this.#engine.mochila.guarda(ferramenta);
			if (guardou) {
				this.#ferramentas.delete(nomeFerramenta);
				return true;
			}
		}
		return false;
	}

	sai(porta) {
		validate(porta, "String");
		return this.#portas.get(porta);
	}

	textoDescricao() {
		let descricao = "Você está no " + this.nome + "\n";
		if (this.objetos.size == 0) {
			descricao += "Não há objetos na sala\n";
		} else {
			descricao += "Objetos: " + this.objetosDisponiveis() + "\n";
		}
		if (this.ferramentas.size == 0) {
			descricao += "Não há ferramentas na sala\n";
		} else {
			descricao += "Ferramentas: " + this.ferramentasDisponiveis() + "\n";
		}
		descricao += "Portas: " + this.portasDisponiveis().join(", ") + "\n";
		return descricao;
	}

	usa(ferramenta, objeto) {
		return false;
	}

	aoEntrar() {
		// Método opcional para ser sobrescrito por subclasses (ex: BibliotecaSombria)
	}
}

export class Engine {
	#mochila;
	#salaCorrente;
	#fim;

	constructor() {
		this.#mochila = new Mochila();
		this.#salaCorrente = null;
		this.#fim = false;
		this.criaCenario();
	}

	get mochila() {
		return this.#mochila;
	}

	get salaCorrente() {
		return this.#salaCorrente;
	}

	set salaCorrente(sala) {
		validate(sala, Sala);
		this.#salaCorrente = sala;
	}

	indicaFimDeJogo() {
		this.#fim = true;
	}

	criaCenario() {}

	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;
		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que voce deseja fazer? ");
			tokens = acao.split(" ");
			switch (tokens[0]) {
				case "descartar":
					this.#mochila.descarta(tokens[1]);
					break;
				case "fim":
					this.#fim = true;
					break;
				case "pegar":
					if (this.salaCorrente.pega(tokens[1])) {
						console.log("Ok! " + tokens[1] + " guardado(a)!");
					}
					break;
				case "inventario":
					console.log("Ferramentas disponiveis para serem usadas: " + this.#mochila.inventario());
					break;
				case "usar":
					if (this.salaCorrente.usa(tokens[1], tokens[2])) {
						console.log("Feito !!");
					} else {
						console.log("Não é possível usar " + tokens[1] + " sobre " + tokens[2] + " nesta sala");
					}
					break;
				case "entrar":
					novaSala = this.salaCorrente.sai(tokens[1]);
					if (novaSala == null) {
						console.log("Sala desconhecida ...");
					} else {
						this.#salaCorrente = novaSala;
						if (typeof novaSala.aoEntrar === "function") {
							novaSala.aoEntrar();
						}
					}
					break;
				default:
					console.log("Comando desconhecido: " + tokens[0]);
					break;
			}
		}
		console.log("Jogo encerrado!");
	}
}

