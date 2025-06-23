import { Engine } from "./Basicas.js";
import { PortaoDecrepito, HallGrandioso, SalaDoPiromante, BibliotecaSombria, Antessala, SalaDoTrono } from "./SalasJogo.js";

export class JogoAventura extends Engine {
    constructor() {
        super();
    }

    criaCenario() {
        let portao = new PortaoDecrepito(this);
        let hall = new HallGrandioso(this);
        let piromante = new SalaDoPiromante(this);
        let biblioteca = new BibliotecaSombria(this);
        let antessala = new Antessala(this);
        let trono = new SalaDoTrono(this);

        portao.portas.set(hall.nome, hall);
        hall.portas.set(portao.nome, portao);
        hall.portas.set(piromante.nome, piromante);
        hall.portas.set(biblioteca.nome, biblioteca);
        hall.portas.set(antessala.nome, antessala);
        piromante.portas.set(hall.nome, hall);
        biblioteca.portas.set(hall.nome, hall);
        antessala.portas.set(hall.nome, hall);
        antessala.portas.set(trono.nome, trono);
        trono.portas.set(antessala.nome, antessala);

        this.salaCorrente = portao;
    }
}
