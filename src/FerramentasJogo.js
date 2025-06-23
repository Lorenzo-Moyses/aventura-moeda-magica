import { Ferramenta } from "./Basicas.js";

export class PalavraMagica extends Ferramenta {
    constructor() {
        super("aperio");
    }

    usar() {
        return true;
    }
}

export class Machado extends Ferramenta {
    #usado;

    constructor() {
        super("machado");
        this.#usado = false;
    }

    usar() {
        if (this.#usado) return false;
        this.#usado = true;
        return true;
    }
}

export class Lamparina extends Ferramenta {
    #cargas;

    constructor() {
        super("lamparina");
        this.#cargas = 2;
    }

    usar() {
        if (this.#cargas > 0) {
            this.#cargas--;
            if (this.#cargas === 0) {
                console.log("A lamparina se apagou. Você não pode mais navegar com clareza em salas escuras.");
            } else {
                console.log(`A lamparina brilha. Cargas restantes: ${this.#cargas}`);
            }
            return true;
        } else {
            console.log("A lamparina está sem óleo e não funciona mais.");
            return false;
        }
    }

    temCarga() {
        return this.#cargas > 0;
    }
}

export class ChaveOrnamentada extends Ferramenta {
    constructor() {
        super("chave_ornamentada");
    }

    usar() {
        return true;
    }
}

export class PinçaLonga extends Ferramenta {
    constructor() {
        super("pinca_longa");
    }

    usar() {
        return true;
    }
}


