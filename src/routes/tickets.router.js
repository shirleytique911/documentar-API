import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

const router = Router()

const ticketMongo = new Tickets()

router.get("/", async (req, res) => {
    try
    {
        let result = await ticketMongo.get()
        res.status(200).send({ status: "success", payload: result });
    }
    catch (error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    } 
})

router.post("/", async (req, res) => {
    try
    {
        let { amount, purchaser } = req.body
        let tick = new TicketDTO({ amount, purchaser })
        let result = await ticketService.createTicket(tick)
        res.status(200).send({ status: "success", payload: result });
    }
    catch(error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

export default router