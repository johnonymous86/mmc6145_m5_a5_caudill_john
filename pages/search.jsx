import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchRecipes } from '../util/recipe'
import styles from '../styles/search.module.css'

export async function getServerSideProps({ query }) {
  const props = {}
  if (query.q) {
    props.recipes = await searchRecipes(query.q)
  }
  return { props }
}

export default function Search({recipes}) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    router.replace(router.pathname + '?q=' + encodeURIComponent(query.trim()))
  }
  return (
    <>
      <Head>
        <title>Search Yummy!</title>
        <meta name="description" content="Search for recipes on Yummy!" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍴</text></svg>"/>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="recipe-search">Search by keywords:</label>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          name="recipe-search"
          id="recipe-search" autoFocus/>
        <button type="submit">Submit</button>
      </form>
      {
        recipes?.length
        ? <section className={styles.results}>
          {recipes.map(recipe => (
            <RecipePreview key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image} />
          ))}
        </section>
        : <p className={styles.noResults}>No Recipes Found!</p>
      }
    </>
  )
}

function RecipePreview({id, title, image}) {
  return (
    <Link href={'/recipe/' + id} className={styles.preview}>
      <Image src={image} width="312" height="231" alt={title}/>
      <span>{title}</span>
    </Link>
  )
}