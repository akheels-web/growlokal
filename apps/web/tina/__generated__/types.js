export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const GlobalPartsFragmentDoc = gql`
    fragment GlobalParts on Global {
  __typename
  siteName
  tagline
  headerLogoUrl
  footerLogoUrl
  faviconUrl
  logoAlt
  supportPhone
  whatsappNumber
  whatsappDefaultMsg
  metaTitle
  metaDescription
}
    `;
export const NavigationPartsFragmentDoc = gql`
    fragment NavigationParts on Navigation {
  __typename
  navLinks {
    __typename
    label
    url
    isHighlight
  }
  headerCta {
    __typename
    label
    url
  }
  footerTagline
  freeGrowthTools {
    __typename
    label
    url
  }
  industrySolutions {
    __typename
    label
    url
  }
  topLocations {
    __typename
    label
    url
  }
  accountHelp {
    __typename
    label
    url
  }
  copyrightText
}
    `;
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  title
  hero {
    __typename
    badgeText
    headlinePrefix
    headlineAccent
    headlineSuffix
    subheadline
    primaryCta {
      __typename
      label
      url
    }
    secondaryCta {
      __typename
      label
      url
    }
    trustBadges {
      __typename
      icon
      text
    }
    heroImage
  }
  growthTools {
    __typename
    eyebrow
    title
    subtitle
    cards {
      __typename
      badge
      title
      desc
      btnLabel
      btnUrl
    }
  }
  painPoints {
    __typename
    eyebrow
    title
    subtitle
    cards {
      __typename
      stat
      statLabel
      title
      desc
      solution
    }
  }
  aiAgents {
    __typename
    eyebrow
    title
    subtitle
    agents {
      __typename
      name
      role
      badge
      avatar
      features
    }
  }
  results {
    __typename
    eyebrow
    title
    subtitle
    beforeDay1 {
      __typename
      title
      score
      desc
      metrics
      image
    }
    afterDay30 {
      __typename
      title
      score
      desc
      metrics
      image
    }
    pillars {
      __typename
      icon
      title
      desc
      statTag
    }
  }
  pricing {
    __typename
    eyebrow
    title
    subtitle
    discountBadge
    starter {
      __typename
      title
      subtitle
      monthlyPrice
      annualPrice
      annualSavingsNote
      features
      btnText
      btnUrl
    }
    growth {
      __typename
      title
      subtitle
      badge
      monthlyPrice
      annualPrice
      annualSavingsNote
      features
      btnText
      btnUrl
    }
  }
  faq {
    __typename
    eyebrow
    title
    subtitle
    questions {
      __typename
      q
      a
    }
  }
}
    `;
export const PostPartsFragmentDoc = gql`
    fragment PostParts on Post {
  __typename
  title
  slug
  date
  author
  category
  excerpt
  coverImage
  readTime
  body
}
    `;
export const GlobalDocument = gql`
    query global($relativePath: String!) {
  global(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...GlobalParts
  }
}
    ${GlobalPartsFragmentDoc}`;
export const GlobalConnectionDocument = gql`
    query globalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GlobalFilter) {
  globalConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...GlobalParts
      }
    }
  }
}
    ${GlobalPartsFragmentDoc}`;
export const NavigationDocument = gql`
    query navigation($relativePath: String!) {
  navigation(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...NavigationParts
  }
}
    ${NavigationPartsFragmentDoc}`;
export const NavigationConnectionDocument = gql`
    query navigationConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: NavigationFilter) {
  navigationConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...NavigationParts
      }
    }
  }
}
    ${NavigationPartsFragmentDoc}`;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export const PostDocument = gql`
    query post($relativePath: String!) {
  post(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PostParts
  }
}
    ${PostPartsFragmentDoc}`;
export const PostConnectionDocument = gql`
    query postConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PostFilter) {
  postConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PostParts
      }
    }
  }
}
    ${PostPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    global(variables, options) {
      return requester(GlobalDocument, variables, options);
    },
    globalConnection(variables, options) {
      return requester(GlobalConnectionDocument, variables, options);
    },
    navigation(variables, options) {
      return requester(NavigationDocument, variables, options);
    },
    navigationConnection(variables, options) {
      return requester(NavigationConnectionDocument, variables, options);
    },
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    post(variables, options) {
      return requester(PostDocument, variables, options);
    },
    postConnection(variables, options) {
      return requester(PostConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
