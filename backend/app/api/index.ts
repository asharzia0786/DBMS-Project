import { Router } from "express";

import customOrdersRouter from "./custom-orders.routes";
import inquiriesRouter from "./inquiries.routes";
import mediaRouter from "./media.routes";
import ordersRouter from "./orders.routes";
import paymentsRouter from "./payments.routes";
import productsRouter from "./products.routes";
import webhooksRouter from "./webhooks.routes";

const router = Router();

router.use("/products", productsRouter);
router.use("/custom-orders", customOrdersRouter);
router.use("/orders", ordersRouter);
router.use("/payments", paymentsRouter);
router.use("/media", mediaRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/webhooks", webhooksRouter);

export default router;
