import { InquiryRepository } from "../repositories/inquiry.repository";
import type {
  CreateInquiryInput,
  InquiryListQuery,
} from "../validators/inquiry.validator";

export class InquiryService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

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
      name: input.name,
      phone: input.phone,
      city: input.city,
      message: input.message,
      status: "NEW",
    });
  }
}
