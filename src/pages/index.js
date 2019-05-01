import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.group

    // Group the posts in each year by month
    // This would be unnecessary if it were already grouped
    const postsByYearAndMonth = posts.reduce((arr, item) => {
      const postsByMonth = item.edges.reduce((obj, {node}) => {
        const month = node.fields.month
        obj[month] = obj[month] || []
        obj[month].push(node)
        return obj
      }, {})
      arr.push({year: item.fieldValue, posts: Object.entries(postsByMonth)})
      return arr
    }, [])

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <Bio />
        {postsByYearAndMonth.map((item) => 
          <div>
            <h1>{item.year}</h1>
            {item.posts.map(item => {
              const month = item[0]
              const posts = item[1]
              return <div>
                <h2>{month}</h2>
                {posts.map(node => {
                  const title = node.frontmatter.title || node.fields.slug
                  return <div>
                    <h3>
                      <Link to={node.fields.slug}>
                        {title}
                      </Link>
                    </h3>
                    <small>{node.frontmatter.date}</small>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt,
                      }}
                    />
                  </div>
                })}
              </div>
            })}
          </div>
        )}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: fields___year) {
        fieldValue
        edges {
          node {
            excerpt
            fields {
              slug
              month
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
            }
          }
        }
      }
    }
  }
`
