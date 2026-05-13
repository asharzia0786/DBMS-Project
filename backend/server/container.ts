import { CustomOrderRepository } from "./repositories/custom-order.repository";
import { InquiryRepository } from "./repositories/inquiry.repository";
import { OrderRepository } from "./repositories/order.repository";
import { ProductRepository } from "./repositories/product.repository";
import { UserRepository } from "./repositories/user.repository";
import { AuthzService } from "./services/authz.service";
import { CustomOrderService } from "./services/custom-order.service";
import { InquiryService } from "./services/inquiry.service";
import { MediaService } from "./services/media.service";
import { NotificationService } from "./services/notification.service";
import { OrderService } from "./services/order.service";
import { PaymentService } from "./services/payment.service";
import { ProductService } from "./services/product.service";
import { UserService } from "./services/user.service";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const customOrderRepository = new CustomOrderRepository();
const orderRepository = new OrderRepository();
const inquiryRepository = new InquiryRepository();
const notificationService = new NotificationService();

export const services = {
  userService: new UserService(userRepository),
  productService: new ProductService(productRepository),
  customOrderService: new CustomOrderService(customOrderRepository, notificationService),
  orderService: new OrderService(orderRepository, notificationService),
  paymentService: new PaymentService(orderRepository),
  inquiryService: new InquiryService(inquiryRepository, notificationService),
  mediaService: new MediaService(),
  notificationService,
  authzService: new AuthzService(),
};
