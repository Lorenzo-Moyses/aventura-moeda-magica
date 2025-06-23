import { Objeto, Ferramenta } from "./Basicas.js";
import { Machado, Lamparina } from "./FerramentasJogo.js";

export class MapaAntigo extends Objeto {
    constructor() {
        super("mapa", "Um mapa antigo e amarelado.", "Um mapa antigo e amarelado.");
    }

    usar(ferramenta) {
        return false; // N vai interagir com as outras ferramentas
    }
}

export class Teia extends Objeto {
    #cortada;

    constructor() {
        super("teia", "Uma grande teia bloqueia o caminho.", "A teia foi cortada.");
        this.#cortada = false;
    }

    usar(ferramenta) {
        if (ferramenta instanceof Machado && ferramenta.usar()) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class InscricaoSanguinea extends Objeto {
    constructor(teiaRef) {
        super("inscricao", "Está escondida por trás da teia.", "A inscrição em sangue diz: 'Aperio'.");
        this.teia = teiaRef;
    }

    get descricao() {
        if (!this.teia.acaoOk) {
            return "Está escondida por trás da teia.";
        } else {
            return "A inscrição em sangue diz: 'Aperio'.";
        }
    }

    usar(ferramenta) {
        return false;
    }
}


import { ChaveOrnamentada, PinçaLonga } from "./FerramentasJogo.js";

// Baú tancado
export class BauTrancado extends Objeto {
    #palavraChave;
    constructor(engine) {
        super("bau", "Um baú trancado com uma inscrição enigmática: 'Apenas a palavra mágica abrirá a tranca'.", "O baú foi aberto. Há itens dentro.");
        this.#palavraChave = "aperio";
        this.engine = engine;
    }

    usar(ferramenta) {
        if (ferramenta.nome.toLowerCase() === "aperio") {
            this.acaoOk = true;

            let chave = new ChaveOrnamentada();
            let pinc = new PinçaLonga();

            
            this.engine.salaCorrente.ferramentas.set(chave.nome, chave);
            this.engine.salaCorrente.ferramentas.set(pinc.nome, pinc);
            this.engine.salaCorrente.objetos.delete(this.nome);
            return true;
        }
        return false;
    }
}

// Porta ornamentada
export class PortaOrnamentada extends Objeto {
    constructor() {
        super("porta", "Uma grande porta trancada com entalhes antigos.", "A porta está aberta.");
    }

    usar(ferramenta) {
        if (ferramenta instanceof ChaveOrnamentada && ferramenta.usar()) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

// Dragão com moeda
export class DragaoComMoeda extends Objeto {
    constructor(engine) {
        super("dragao", "Um dragão dorme com uma moeda mágica no nariz.", "Você pegou a moeda sem acordá-lo.");
        this.engine = engine;
    }

    usar(ferramenta) {
        if (ferramenta instanceof PinçaLonga && ferramenta.usar()) {
            this.acaoOk = true;
            this.engine.indicaFimDeJogo();
            return true;
        } else {
            console.log("Você tentou pegar a moeda com a mão... o dragão acorda e te incinera.");
            this.engine.indicaFimDeJogo();
            return true;
        }
    }
}

