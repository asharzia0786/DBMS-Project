import { InquiryRepository } from "../repositories/inquiry.repository";
import { NotificationService } from "./notification.service";
import { AppError } from "../utils/app-error";
import type {
  CreateInquiryInput,
  InquiryListQuery,
} from "../validators/inquiry.validator";

export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly notificationService?: NotificationService,
  ) {}

  public async listInquiries(params: InquiryListQuery) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await this.inquiryRepository.findAll({
      skip,
      take: params.pageSize,
      status: params.status,
    });

    return {
      items,
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize) || 1,
    };
  }

  public createInquiry(input: CreateInquiryInput) {
    return this.inquiryRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city: input.city,
      message: input.message,
      status: "NEW",
    });
  }

  public async updateStatus(input: {
    id: string;
    status: string;
    responseMessage?: string;
  }) {
    const inquiry = await this.inquiryRepository.findById(input.id);
    if (!inquiry) {
      throw new AppError("Inquiry not found.", "INQUIRY_NOT_FOUND", 404);
    }

    const updated = await this.inquiryRepository.updateStatus(input.id, input.status);
    if (input.responseMessage && this.notificationService) {
      await this.notificationService
        .sendInquiryResponse({
          to: updated.email,
          subject: "Response to your Habib and Sons inquiry",
          message: input.responseMessage,
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Inquiry response email failed", error);
        });
    }
    return updated;
  }
}
