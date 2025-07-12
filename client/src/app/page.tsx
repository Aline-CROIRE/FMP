// src/app/page.tsx
'use client' // Required for styled-components and event handling

import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '../styles/theme'; // Import our theme object

// --- Global Styles ---
// This injects styles into the entire application, like resetting margins.
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

// --- Styled Components ---

const MainContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.bgDark};
  color: ${props => props.theme.colors.textLight};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 64rem; /* 1024px */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 4rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const SwatchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwatchBox = styled.div`
  width: 100%;
  padding-top: 100%; /* Creates a perfect square */
  border-radius: 0.5rem;
  background-color: ${props => props.color};
`;

const SwatchLabel = styled.p`
  margin-top: 0.5rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const SwatchHex = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ButtonLabel = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-transform: capitalize;
`;

// --- Reusable Button Components ---

const BaseButton = styled.button`
  width: 12rem; /* 192px */
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textLight};
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const SecondaryButton = styled(BaseButton)`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.textDark};
  border-color: ${props => props.theme.colors.borderLight};
  &:hover {
    background-color: #e5e7eb; // A light gray for hover
  }
`;

const DisabledButton = styled(BaseButton)`
  background-color: ${props => props.theme.colors.disabled};
  color: #6b7280;
  cursor: not-allowed;
`;

// --- Helper Component for Displaying Colors ---

function ColorSwatch({ name, hex }: { name: string, hex: string }) {
  return (
    <SwatchContainer>
      <SwatchBox color={hex} />
      <div>
        <SwatchLabel>{name}</SwatchLabel>
        <SwatchHex>{hex}</SwatchHex>
      </div>
    </SwatchContainer>
  );
}


// --- The Main Page Component ---

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle /> {/* This applies our global styles */}
      <MainContainer>
        <ContentWrapper>
          
          {/* Column 1: Color Palette */}
          <Section>
            <Title>Color Palette</Title>
            <ColorGrid>
              <ColorSwatch name="gray" hex={theme.colors.bgGray} />
              <ColorSwatch name="green" hex={theme.colors.primary} />
              <ColorSwatch name="white" hex={theme.colors.secondary} />
              <ColorSwatch name="green-hover" hex={theme.colors.primaryHover} />
              <ColorSwatch name="red-error" hex={theme.colors.redError} />
              <ColorSwatch name="black" hex={theme.colors.textDark} />
            </ColorGrid>
          </Section>

          {/* Column 2: Button States */}
          <Section>
            <Title>Button Component States</Title>
            <ButtonGroup>
              <ButtonContainer>
                <ButtonLabel>Primary</ButtonLabel>
                <PrimaryButton>BUTTON</PrimaryButton>
              </ButtonContainer>
              <ButtonContainer>
                <ButtonLabel>Hovered</ButtonLabel>
                {/* We render the primary button but use its hover state for the demo */}
                <PrimaryButton as="div" style={{ backgroundColor: theme.colors.primaryHover }}>BUTTON</PrimaryButton>
              </ButtonContainer>
              <ButtonContainer>
                <ButtonLabel>Secondary</ButtonLabel>
                <SecondaryButton>BUTTON</SecondaryButton>
              </ButtonContainer>
              <ButtonContainer>
                <ButtonLabel>Disabled</ButtonLabel>
                <DisabledButton>BUTTON</DisabledButton>
              </ButtonContainer>
            </ButtonGroup>
          </Section>

        </ContentWrapper>
      </MainContainer>
    </ThemeProvider>
  );
}