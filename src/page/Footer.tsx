import styled from 'styled-components';
import { Link } from '@chakra-ui/react'


const StyledFooter = styled.footer`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-direction: column;
  background: var(--chakra-colors-white);
  border-top: 1px solid #E2E8F0; /* var(--chakra-borders-gray-dark); */
  margin-top: 0px;
  padding-inline-start: var(--chakra-space-6);
  padding-inline-end: var(--chakra-space-6);
  padding-top: var(--chakra-space-8);
  padding-bottom: var(--chakra-space-8);
  width: var(--chakra-sizes-full);
`

const Footer = () => {


  return (
    <StyledFooter>
      Built badly by <Link href="https://twitter.com/lsquaredleland">@lsquaredleland</Link> for Tally
    </StyledFooter>
  )
}

export default Footer