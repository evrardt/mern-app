//import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

function Index(props) {
    return (
        <div>
            <h1>Batman TV Shows</h1>
            <ul>
                {props.photos.slice().map(photo => (
                <li key={photo._id}>
                    <Link as={`/p/${photo._id}`} href={`/post?id=${photo._id}`}>
                        <a>{photo.tagline}</a>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    )
}

Index.getInitialProps = async function() {
  const res = await fetch('http://localhost:3000/api/photos')
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    photos: data
  }
}

export default Index
