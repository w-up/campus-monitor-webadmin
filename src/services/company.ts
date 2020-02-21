import { useAxios } from "../utils/request";

export class CompanyService {
  getCompanyBusinessInfoById({ companyId }: { companyId: number }) {
    return useAxios({ url: "/company-business-info/getCompanyBusinessInfoById", params: { companyId } });
  }
}
