import { FeaturesCard } from '@/components/Landing/FeaturesCard/FeaturesCard';
import { FeaturesGrid } from '@/components/Landing/FeaturesGrid/FeaturesGrid';
import { FooterCentered } from '@/components/Landing/FooterCentered/FooterCentered';
import { HeaderMegaMenu } from '@/components/Landing/HeaderMegaMenu/HeaderMegaMenu';
import { HeroImageRight } from '@/components/Landing/HeroImageRight/HeroImageRight';
import { StatsGridIcons } from '@/components/Landing/StatsGridIcons/StatsGridIcons';
import { TableReviews } from '@/components/Landing/TableReviews/TableReviews';
import { Container, Flex } from '@mantine/core';

export default function HomePage() {
  return (
    <>
      <HeaderMegaMenu/>
      <HeroImageRight/>

      <Container>
        <FeaturesGrid/>
        <TableReviews/>
        <StatsGridIcons/>
        
        <Flex direction="row" justify='space-between'>
          <FeaturesCard/>
          <FeaturesCard/>
          <FeaturesCard/>
        </Flex>
      </Container>

      <FooterCentered/>
    </>
  );
}
