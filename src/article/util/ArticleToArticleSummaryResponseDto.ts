import { Article, Company } from '@prisma/client';
import {ArticleSummaryResponseDto} from '../dto/ArticleSummaryResponseDto'

interface ArticleWithCompany extends Article {
  company: Company
}

export function ArticleToArticleSummaryResponseDto(v: ArticleWithCompany): ArticleSummaryResponseDto {
  return {
    uuid: v.uuid,
    title: v.title,
    contents: v.summaryContents,
    category: v.category,
    createAt: v.createAt,
    ...(v.summaryMediaUrl && v.summaryMediaType && {
      media: {
        mediaType: v.summaryMediaType,
        url: v.summaryMediaUrl,
      }
    }),
    isHeadline: v.isHeadline,
    company: {
      uuid: v.company.uuid,
      profileImageUrl: v.company.profileImageUrl,
      name: v.company.name,
    }
  }
}