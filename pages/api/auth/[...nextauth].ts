import axios from 'axios'
import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth'
import { OAuthConfig } from 'next-auth/providers'
import { HarvestUser } from '../../../types/harvest'
import { MikroOrmAdapter } from '@next-auth/mikro-orm-adapter'
import config from 'config/mikro-orm'
import { User } from 'db/entities/User'

const harvestOauth2AuthorizeUrl = 'https://id.getharvest.com/oauth2/authorize'
const harvestOauth2TokenUrl = 'https://id.getharvest.com/api/v2/oauth2/token'
const currentHarvestUserEndpoint = 'https://api.harvestapp.com/v2/users/me'

const dbConnectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_URL}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`

const harvestProvider: OAuthConfig<HarvestUser> = {
  id: 'harvest',
  name: 'harvest',
  type: 'oauth',
  clientId: process.env.HARVEST_CLIENT_ID,
  clientSecret: process.env.HARVEST_CLIENT_SECRET,
  authorization: harvestOauth2AuthorizeUrl,
  token: {
    url: harvestOauth2TokenUrl,
    async request(context) {
      const { data: tokens } = await axios.post<TokenSet>(
        harvestOauth2TokenUrl,
        {
          code: context.params.code,
          client_id: process.env.HARVEST_CLIENT_ID,
          client_secret: process.env.HARVEST_CLIENT_SECRET,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Harvest-Account-Id': process.env
              .HARVEST_WUNDERDOG_ACCOUNT_ID as string,
          },
        },
      )
      return { tokens }
    },
  },
  userinfo: {
    url: currentHarvestUserEndpoint,
    async request(context) {
      // context contains useful properties to help you make the request.
      context
      const { data: user } = await axios.get(currentHarvestUserEndpoint, {
        headers: {
          'Harvest-Account-Id': process.env
            .HARVEST_WUNDERDOG_ACCOUNT_ID as string,
          Authorization: `Bearer ${context.tokens.access_token}`,
        },
      })
      return user
    },
  },
  issuer: 'harvest',
  client: {
    token_endpoint_auth_method: 'client_secret_post',
  },
  profile(profile) {
    return {
      id: `${profile.id}`,
      harvestId: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
    }
  },
}
const options: NextAuthOptions = {
  adapter: MikroOrmAdapter(config, {
    entities: { User },
  }),
  providers: [harvestProvider],
  jwt: {
    maxAge: 60 * 60 * 12,
  },
  session: {
    strategy: 'jwt',
  },
}

const handler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default handler
