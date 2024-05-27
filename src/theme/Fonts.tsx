import { Global } from '@emotion/react'
// import basier from '/fonts/Basier.otf'
import robotoBold from '/fonts/roboto/Roboto-Bold.ttf'
import roboto from '/fonts/roboto/Roboto-Regular.ttf'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Roboto';
        font-weight: normal;
        src: url('${roboto}') format('truetype');
      }
      @font-face {
        font-family: 'Roboto';
        font-weight: bold;
        src: url('${robotoBold}') format('truetype');
      }
    `}
  />
)

export default Fonts
