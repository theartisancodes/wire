import React, { Component } from 'react';
import Badge from 'material-ui/Badge';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// styles
import './NavBar.scss';

// helpers
import authenticateUser from '../../helpers/auth';

/**
 * @class NavBar
 */
export class NavBar extends Component {
  /**
   * Method to handle Sign out
   * @param {event} event - Event triggering signing out
   */
  handleSignOut = (event) => {
    event.preventDefault();
    authenticateUser.logoutUser();
  };

  /**
   * Method to redirect to search
   * @param {event} event - Event triggering search
   */
  handleSearch = (event) => {
    event.preventDefault();
    this.props.history.push('/search');
  };

  render() {
    const { showSearch, notify } = this.props;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <Link to="/dashboard">
          <img className="logo" src="/assets/images/andelaLogo.png" alt="Wire" />
        </Link>
        <div className="right-nav-section">
          {showSearch ? (
            <div className="search">
              <input className="search-input" onFocus={this.handleSearch} type="text" placeholder="Search" />
            </div>
          ) : null}
          {notify ? (
            <div className="notifications">
              <img src="/assets/images/bell_icon.svg" color="#3960ad" className="notification-icon" />
              <Badge badgeContent={3} className="badge" />
            </div>
          ) : null}
          <div className="profile">
            <div className="dropdowntn">
              <img className="profile-img" src={localStorage.getItem('user_avatar')} alt="Wire" />
              <span className="user-name">{localStorage.getItem('user')}</span>
              <i className="fa fa-caret-down" aria-hidden="true" />
            </div>
            <div className="dropdown-content">
              {authenticateUser.isAdmin() ? (
                <Link to="/settings">
                  <span>Settings</span>
                </Link>
              ) : null}
              <span id="logout" onClick={this.handleSignOut}>Logout</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
NavBar.propTypes = {
  history: PropTypes.object.isRequired,
  showSearch: PropTypes.bool,
  notify: PropTypes.bool,
};

NavBar.defaultProps = {
  showSearch: true,
  notify: true,
};

export default NavBar;
