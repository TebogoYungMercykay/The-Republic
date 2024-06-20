import { Issue } from "../models/issue";
import supabase from "../services/supabaseClient";
import { DateTime } from 'luxon';
import ReactionRepository from "./reactionRepository";
import { GetIssuesParams } from "../types/issue";
import { CategoryRepository } from "./categoryRepository";
import { APIError } from "../types/response";
import { CommentRepository } from "./commentRepository";
import { LocationRepository } from "./locationRepository";

const reactionRepository = new ReactionRepository();
const categoryRepository = new CategoryRepository();
const commentRepository = new CommentRepository();

export default class IssueRepository {
  async getIssues({
    from,
    amount,
    category,
    mood,
    user_id
  }: Partial<GetIssuesParams>) {
    let query = supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `)
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);
  
    if (category) {
      const categoryId = await categoryRepository.getCategoryId(category);
      query = query.eq("category_id", categoryId);
    }
  
    if (mood) {
      query = query.eq("sentiment", mood);
    }
  
    const { data, error } = await query;
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }
  
    const issues = await Promise.all(data.map(
      async (issue: Issue) => {
        const reactions = await reactionRepository.getReactionCountsByIssueId(issue.issue_id);
        const userReaction = user_id ? await reactionRepository.getReactionByUserAndIssue(issue.issue_id, user_id) : null;
        const commentCount = await commentRepository.getNumComments(issue.issue_id);
        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          comment_count: commentCount,
          is_owner: issue.user_id === user_id,
          user: issue.is_anonymous ? {
            user_id: null,
            email_address: null,
            username: 'Anonymous',
            fullname: 'Anonymous',
            image_url: null
          } : issue.user
        };
      }
    ));
  
    return issues as Issue[];
  }
  
  async getIssueById(issueId: number, user_id?: string) {
    const { data, error } = await supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `)
      .eq("issue_id", issueId)
      .maybeSingle();
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }
  
    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist"
      });
    }
  
    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);
    const userReaction = user_id ? await reactionRepository.getReactionByUserAndIssue(data.issue_id, user_id) : null;
    const commentCount = await commentRepository.getNumComments(data.issue_id);
  
    return {
      ...data,
      reactions,
      user_reaction: userReaction?.emoji || null,
      comment_count: commentCount,
      is_owner: data.user_id === user_id,
      user: data.is_anonymous ? {
        user_id: null,
        email_address: null,
        username: 'Anonymous',
        fullname: 'Anonymous',
        image_url: null
      } : data.user
    } as Issue;
  }

  async createIssue(issue: Partial<Issue>) {
    issue.created_at = new Date().toISOString();
  
    let locationId: number | null = null;
  
    if (issue.location_data && issue.location_data.place_id) {
      const locationRepository = new LocationRepository();
      const existingLocation = await locationRepository.getLocationByPlacesId(issue.location_data.place_id);
  
      if (existingLocation) {
        locationId = existingLocation.location_id;
      } else {
        const newLocation = await locationRepository.createLocation({
          place_id: issue.location_data.place_id,
          province: issue.location_data.province,
          city: issue.location_data.city,
          suburb: issue.location_data.suburb,
          district: issue.location_data.district
        });
        locationId = newLocation.location_id;
      }
    }
  
    const { data, error } = await supabase
      .from("issue")
      .insert({
        user_id: issue.user_id,
        category_id: issue.category_id,
        content: issue.content,
        sentiment: issue.sentiment,
        is_anonymous: issue.is_anonymous,
        location_id: locationId,
        created_at: issue.created_at,
      })
      .select()
      .single();
  
    if (error) {
      console.error(error);
  
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }
  
    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);
  
    return {
      ...data,
      reactions,
      is_owner: true,
      user: data.is_anonymous ? {
        user_id: null,
        email_address: null,
        username: 'Anonymous',
        fullname: 'Anonymous',
        image_url: null
      } : data.user
    } as Issue;
  }

  async updateIssue(
    issueId: number,
    issue: Partial<Issue>,
    user_id: string
  ) {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist"
      });
    }

    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);

    return {
      ...data,
      reactions,
      is_owner: true,
      user: data.is_anonymous ? {
        user_id: null,
        email_address: null,
        username: 'Anonymous',
        fullname: 'Anonymous',
        image_url: null
      } : data.user
    } as Issue;
  }

  async deleteIssue(issueId: number, user_id: string) {
    const { data, error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist"
      });
    }
  }

  async resolveIssue(issueId: number, user_id: string) {
    const resolvedAt = DateTime.now().setZone('UTC+2').toISO();
    const { data, error } = await supabase
      .from("issue")
      .update({ resolved_at: resolvedAt })
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist"
      });
    }

    return data as Issue;
  }
}
