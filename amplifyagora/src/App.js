import React from 'react';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { Auth, Hub } from 'aws-amplify';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import NavBar from './components/Navbar';
import './App.css';

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    console.dir(AmplifyTheme);
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }
  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };

  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        console.log('signed in');
        this.getUserData();
        break;
      case 'signUp':
        console.log('signed up');
        break;
      case 'signOut':
        console.log('signed out');
        this.setState({ user: null });
        break;
      default:
        return;
    }
  };

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <Router>
        <>
          <NavBar user={user} />

          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route
              path="/markets/:marketId"
              component={({ match }) => (
                <MarketPage marketId={match.params.marketId} />
              )}
            />
          </div>
        </>
      </Router>
    );
  }
}

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'green',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '5px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: 'var(--squidInk)',
  },
};

//export default withAuthenticator(App, true, [], null, theme);

export default App;
