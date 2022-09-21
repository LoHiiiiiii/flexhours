import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const { data: session, status } = useSession()
  console.log(session, status)
  if (!session?.user?.name) {
    return null
  }
  // If session exists, display content
  return (
    <div>
      <h1>Protected Page</h1>
      <p>
        <strong>Welcome {session.user.name}</strong>
      </p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.user) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  // TODO: user exists. Fetch related access token from session/DB and fetch user time-entries from harvest API using access token

  return {
    props: {
      session,
    },
  }
}
