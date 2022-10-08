import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Landing from '../../scenes/Landing';
import ReviewPage from '../../scenes/ReviewPage'
import { Container } from '@mantine/core';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Container size="lg" px="xs" style={{ display: 'flex' }}>
      <TransitionGroup className="w-full h-full">
        {/*
        This is no different than other usage of
        <CSSTransition>, just make sure to pass
        `location` to `Switch` so it can match
        the old location as it animates out.
      */}
        <CSSTransition
          key={location.pathname}
          classNames={'fade'}
          timeout={300}>
          <Routes location={location}>
            <Route path="/review/:documentId" element={<ReviewPage />} />
            <Route path="/" element={<Landing />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </Container>
  );
}

export default AnimatedRoutes;
