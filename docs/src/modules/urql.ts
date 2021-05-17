import { UserModule } from '~/types'
import urql from '@urql/vue'

export const install: UserModule = ({ isClient, app }) => {
  if (!isClient)
    return

  app.use(urql, { url: 'https://spotify-graphql-server.herokuapp.com/graphql' })  
}
