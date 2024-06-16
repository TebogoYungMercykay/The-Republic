import IssueRepository from "../db/issueRepository";
import { Issue } from "../models/issue";
import { GetIssuesParams } from "../types/issue";
import { APIData, APIError } from "../types/response";

export default class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  setIssueRepository(issueRepository: IssueRepository): void {
    this.issueRepository = issueRepository;
  }

  async getIssues(params: Partial<GetIssuesParams>) {
    // `from` can be 0
    if (params.from === undefined || !params.amount) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting issues"
      });
    }

    const issues = await this.issueRepository.getIssues(params);

    return APIData({
      code: 200,
      success: true,
      data: issues,
    });
  }

  async getIssueById(issue: Partial<Issue>) {
    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting an issue"
      });
    }

    const resIssue = await this.issueRepository.getIssueById(issue_id, issue.user_id);

    return APIData({
      code: 200,
      success: true,
      data: resIssue
    });
  }

  async createIssue(issue: Partial<Issue>) {
    if (!issue.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create an issue"
      });
    }

    if (!issue.category_id || !issue.content) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for creating an issue"
      });
    }

    if (issue.content.length > 500) {
      throw APIError({
        code: 413,
        success: false,
        error: "Issue content exceeds the maximum length of 500 characters"
      });
    }

    delete issue.issue_id;

    const createdIssue = await this.issueRepository.createIssue(issue);

    return APIData({
      code: 201,
      success: true,
      data: createdIssue,
    });
  }

  async updateIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to update an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for updating an issue"
      });
    }

    if (issue.created_at || issue.resolved_at) {
      throw APIError({
        code: 400,
        success: false,
        error: "Cannot change the time an issue was created or resolved"
      });
    }

    delete issue.user_id;
    delete issue.issue_id;

    const updatedIssue = await this.issueRepository.updateIssue(issue_id, issue, user_id);

    return APIData({
      code: 200,
      success: true,
      data: updatedIssue
    });
  }

  async deleteIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting an issue"
      });
    }

    await this.issueRepository.deleteIssue(issue_id, user_id);

    return APIData({
      code: 204,
      success: true
    });
  }

  async resolveIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to resolve an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for resolving an issue"
      });
    }

    const resolvedIssue = await this.issueRepository.resolveIssue(issue_id, user_id);

    return APIData({
      code: 200,
      success: true,
      data: resolvedIssue,
    });
  }
}
