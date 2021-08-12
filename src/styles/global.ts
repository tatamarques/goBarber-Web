import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  html{
    @media (max-width: 1080px) {
      font-size: 93.75%;
    }

    @media( max-width: 720px) {
      font-size: 87.5%;
    }
  }

  body {
    background: #312E38;
    color: #FFF;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button{
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong{
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
