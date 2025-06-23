import { PalavraMagica } from "./FerramentasJogo.js";
import { Sala } from "./Basicas.js";
import { Machado, Lamparina } from "./FerramentasJogo.js";
import { MapaAntigo, Teia, InscricaoSanguinea, BauTrancado, PortaOrnamentada, DragaoComMoeda } from "./ObjetosJogo.js";

// Portão Decrépito
export class PortaoDecrepito extends Sala {
	constructor(engine) {
		super("Portao_Decrepito", engine);
		let mapa = new MapaAntigo();
		let machado = new Machado();
		this.objetos.set(mapa.nome, mapa);
		this.ferramentas.set(machado.nome, machado);
	}
}

// Hall Grandioso
export class HallGrandioso extends Sala {
	constructor(engine) {
		super("Hall_Grandioso", engine);
		let bau = new BauTrancado(this.engine);
		this.objetos.set(bau.nome, bau);
	}

	usa(ferramenta, objeto) {
		if (!this.engine.mochila.tem(ferramenta)) return false;
		if (!this.objetos.has(objeto)) return false;
		let obj = this.objetos.get(objeto);
		return obj.usar(this.engine.mochila.pega(ferramenta));
	}
}

// Sala do Piromante
export class SalaDoPiromante extends Sala {
	constructor(engine) {
		super("Sala_do_Piromante", engine);
		let lamparina = new Lamparina();
		this.ferramentas.set(lamparina.nome, lamparina);
	}

	usa(ferramenta, objeto) {
		return false;
	}
}

// Biblioteca Sombria
export class BibliotecaSombria extends Sala {
	constructor(engine) {
		super("Biblioteca_Sombria", engine);
		let teia = new Teia();
		let inscricao = new InscricaoSanguinea(teia);
		this.objetos.set(teia.nome, teia);
		this.objetos.set(inscricao.nome, inscricao);
	}

	aoEntrar() {
		const lamparina = this.engine.mochila.pega("lamparina");
		if (lamparina && typeof lamparina.usar === "function" && lamparina.temCarga()) {
			lamparina.usar(); // consome 1 carga ao entrar
		}
	}

	textoDescricao() {
		const lamparina = this.engine.mochila.pega("lamparina");
		if (!lamparina || !lamparina.temCarga()) {
			return `Você está no ${this.nome}\nEstá tudo escuro. Você precisa de uma fonte de luz para explorar essa sala.\nPortas: ${this.portasDisponiveis().join(", ")}`;
		}
		return super.textoDescricao();
	}

	usa(ferramenta, objeto) {
		if (!this.engine.mochila.tem(ferramenta)) return false;
		if (!this.objetos.has(objeto)) return false;

		const lamparina = this.engine.mochila.pega("lamparina");
		if (!lamparina || !lamparina.temCarga()) {
			console.log("Está escuro demais para usar isso.");
			return false;
		}

		const obj = this.objetos.get(objeto);
		const ferr = this.engine.mochila.pega(ferramenta);

		const resultado = obj.usar(ferr);

		if (obj instanceof Teia && obj.acaoOk && !this.engine.mochila.tem("aperio")) {
			this.engine.mochila.guarda(new PalavraMagica());
		}

		return resultado;
	}
}

// Antessala
export class Antessala extends Sala {
	constructor(engine) {
		super("Antessala", engine);
		let porta = new PortaOrnamentada();
		this.objetos.set(porta.nome, porta);
	}

	usa(ferramenta, objeto) {
		if (!this.engine.mochila.tem(ferramenta)) return false;
		if (!this.objetos.has(objeto)) return false;
		let obj = this.objetos.get(objeto);
		return obj.usar(this.engine.mochila.pega(ferramenta));
	}
}

// Sala do Trono
export class SalaDoTrono extends Sala {
	constructor(engine) {
		super("Sala_do_Trono", engine);
		let dragao = new DragaoComMoeda(this.engine);
		this.objetos.set(dragao.nome, dragao);
	}

	usa(ferramenta, objeto) {
		if (!this.objetos.has(objeto)) return false;

		const obj = this.objetos.get(objeto);

		if (objeto === "dragao" && ferramenta !== "pinca_longa") {
			console.log("Você tentou pegar a moeda com algo inadequado... o dragão acorda e te incinera.");
			this.engine.indicaFimDeJogo();
			return false;
		}

		if (!this.engine.mochila.tem(ferramenta)) return false;

		return obj.usar(this.engine.mochila.pega(ferramenta));
	}
}




