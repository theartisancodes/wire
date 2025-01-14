import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchStaff, inviteUser, searchUsers,
  updateUser, removeUser,
} from '../../actions/staffAction';
import { fetchRoles } from '../../actions/rolesAction';
import { fetchLocations } from '../../actions/locationsAction';
import { matchPositionToRoleId, matchLocationToLocationId } from '../../helpers/adminDashboard';
import './AdminDashboard.scss';
import NavBar from '../../Common/NavBar/NavBar.Component';
import AvailableUser from '../../Components/AvailableUser/AvailableUser.Component';
import UserFilter from '../../Components/UserFilter/UserFilter.Component';
import CustomNotification from '../../Components/CustomNotification/CustomNotification.Component';
import CircularProgressIndicator from '../../Components/Progress/Progress.Component';

/**
 * @class Dashboard
 */
export class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryFilter: 'All Countries',
      loggedInUser: localStorage.getItem('email'),
    };
  }

  componentDidMount() {
    this.props.fetchStaff();
    this.props.fetchRoles();
    this.props.fetchLocations();
  }

  handleSearch = (query) => {
    if (query) {
      this.props.searchUsers(query);
    }
  };

  /**
   * Method to handle the invite user api call
   */
  handleInvite = (email, position, location) => {
    const { roles, locations } = this.props;
    const roleId = matchPositionToRoleId(roles, position);
    const locationId = matchLocationToLocationId(locations, location);
    this.props.inviteUser(email, roleId, locationId);
  };

  /**
   * Method to handle position change
   */
  handlePositionChange = (position, userId, index) => {
    const { roles } = this.props;
    const roleId = matchPositionToRoleId(roles, position);
    this.props.updateUser(userId, roleId, index);
  };

  /**
   * Method to handle user removal
   */
  handleRemove = (userId, index) => {
    this.props.removeUser(userId, index);
  };

  filterStaff = () => {
    let { staff } = this.props;
    const { loggedInUser } = this.state;
    // filter by countries
    if (this.state.countryFilter !== 'All Countries') {
      staff = staff.filter(user => this.state.countryFilter
        .toLocaleLowerCase() === user.Location.country.toLowerCase());
    }
    const newStaff = staff.filter(user => user.email !== loggedInUser);
    return newStaff;
  };

  changeCountryFilter() {
    return (key) => {
      this.setState({ countryFilter: key });
    };
  }

  render() {
    const { isLoading, isError, errorMessage } = this.props;
    const staff = this.filterStaff();
    return (
      <div>
        <NavBar {...this.props} showSearch={false} />
        {isLoading ? (
          <CircularProgressIndicator />
        ) : (
          <div className="admin-dashboard">
            <UserFilter
              staff={staff}
              handleSearch={this.handleSearch}
              handleInvite={this.handleInvite}
              changeCountryFilter={this.changeCountryFilter()}
            />
            <div className="available-users">
              {staff.length ? (
                staff.map((staffMember, i) => (
                  <AvailableUser
                    key={i}
                    id={staffMember.id}
                    index={this.props.staff.indexOf(staffMember)}
                    imageUrl={staffMember.imageUrl}
                    username={staffMember.username}
                    role={staffMember.Role.name.toUpperCase()}
                    country={staffMember.Location.country}
                    handlePositionChange={this.handlePositionChange}
                    handleRemove={this.handleRemove}
                  />
                ))
              ) : (
                <div className="no-users">
                  <p>Sorry, no users. Invite some?</p>
                </div>
              )}
            </div>
          </div>
        )}
        {isError ? (
          <CustomNotification type="error" message={errorMessage} autoHideDuration={15000} open />
        ) : (
          <CustomNotification type="error" message={errorMessage} open={false} />
        )}
      </div>
    );
  }
}

/**
 * Dashboard Component Props validation
 */
AdminDashboard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  fetchStaff: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  staff: PropTypes.array,
  roles: PropTypes.array,
  locations: PropTypes.array,
};

AdminDashboard.defaultProps = {
  staff: [],
  roles: [],
  locations: [],
};

export const mapStateToProps = state => ({
  isLoading: state.isLoading,
  isError: state.error.status,
  errorMessage: state.error.message,
  staff: state.staff,
  roles: state.roles,
  locations: state.locations,
});

/**
 * map dispatch to props
 * @param {*} dispatch
 */
export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchStaff,
    fetchRoles,
    fetchLocations,
    inviteUser,
    searchUsers,
    updateUser,
    removeUser,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
