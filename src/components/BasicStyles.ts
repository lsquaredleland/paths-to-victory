import styled from 'styled-components';


export const H3 = styled.h3`
  color: var(--chakra-colors-purple-900);
  font-family: Montserrat;
  font-size: var(--chakra-fontSizes-xl);
  font-weight: var(--chakra-fontWeights-semibold);
  line-height: 1.875rem;
`;

export const Inline = styled.div`
  display: flex;
  width: 100%
`;

export const H2 = styled.h2`
  color: var(--chakra-colors-purple-900);
  font-family: Montserrat;
  font-size: 1.75rem;
  font-weight: var(--chakra-fontWeights-semibold);
  line-height: var(--chakra-lineHeights-9);
`

export const Wrapper = styled.div`
  background: var(--chakra-colors-gray-50);
  border-bottom: var(--chakra-borders-none);
  padding: var(--chakra-space-4);
`;

export const Article = styled.article`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    background: var(--chakra-colors-white);
    box-shadow:  0px 4px 12px rgba(203, 213, 224, 0.24);  /* var(--chakra-shadows-gray-2); */
    cursor: pointer;
    height: 5.125rem;
    position: relative;
    padding-inline-start: var(--chakra-space-6);
    padding-inline-end: var(--chakra-space-6);
    padding-top: var(--chakra-space-4);
    padding-bottom: var(--chakra-space-4);
    width: var(--chakra-sizes-full);
`;