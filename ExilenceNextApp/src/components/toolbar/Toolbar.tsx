import {
  AppBar,
  Badge,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tooltip
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiToolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import GroupIcon from '@material-ui/icons/Group';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import UpdateIcon from '@material-ui/icons/Update';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
  primaryGradient,
  statusColors
} from '../../assets/themes/exilence-theme';
import { Notification } from '../../store/domains/notification';
import Dd from '../../utils/dropdown.utils';
import AccountMenuContainer from '../account-menu/AccountMenuContainer';
import { drawerWidth } from '../drawer-wrapper/DrawerWrapper';
import CreateGroupDialogContainer from '../group-dialog/GroupDialogContainer';
import { toolbarHeight } from '../header/Header';
import NotificationListContainer from '../notification-list/NotificationListContainer';
import ProfileDialogContainer from '../profile-dialog/ProfileDialogContainer';
import { Profile } from './../../store/domains/profile';
import { resizeHandleContainerHeight } from './../header/Header';
import ToolbarStepperContainer from '../toolbar-stepper/ToolbarStepperContainer';

export const innerToolbarHeight = 50;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    background: primaryGradient,
    top: toolbarHeight + resizeHandleContainerHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fromLeft: {
    marginLeft: drawerWidth
  },
  fromRight: {
    marginRight: drawerWidth
  },
  toolbar: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  },
  hide: {
    display: 'none'
  },
  windowIcon: {
    fontSize: 14,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
  },
  selectMenu: {
    fontSize: '0.9rem'
  },
  iconButton: {
    padding: theme.spacing(0.5)
  },
  toolbarGrid: {
    maxHeight: innerToolbarHeight,
    minHeight: innerToolbarHeight
  },
  profileArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  snapshotArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  miscArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  groupArea: {
    padding: `0 ${theme.spacing(1)}px`
  },
  formControl: {
    padding: `0 ${theme.spacing(0.5)}px`
  },
  divider: {
    height: innerToolbarHeight,
    borderLeft: `1px solid ${theme.palette.primary.dark}`
  },
  spinner: {
    color: theme.palette.primary.contrastText
  },
  leftSpinner: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.contrastText
  },
  badge: {
    backgroundColor: theme.palette.secondary.dark
  },
  offlineIcon: {
    marginRight: theme.spacing(1),
    color: statusColors.warning
  }
}));

interface Props {
  signalrOnline: boolean;
  sidenavOpened: boolean;
  autoSnapshotting: boolean;
  groupOverviewOpened: boolean;
  activeProfile?: Profile;
  profiles: Profile[];
  profileOpen: boolean;
  isEditing: boolean;
  isInitiating: boolean;
  notifications: Notification[];
  unreadNotifications: Notification[];
  isSnapshotting: boolean;
  isUpdatingPrices: boolean;
  profilesLoaded: boolean;
  changingProfile: boolean;
  toggleSidenav: () => void;
  toggleGroupOverview: () => void;
  markAllNotificationsRead: () => void;
  handleProfileOpen: (edit?: boolean) => void;
  handleProfileClose: () => void;
  handleProfileChange: (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  handleSnapshot: () => void;
  handleNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAccountMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleClearSnapshots: () => void;
  handleRemoveProfile: () => void;
}

const Toolbar: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const { t } = useTranslation();
  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

  return (
    <>
      {!atLoginRoute() && (
        <>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]:
                props.sidenavOpened || props.groupOverviewOpened,
              [classes.fromLeft]: props.sidenavOpened,
              [classes.fromRight]: props.groupOverviewOpened
            })}
          >
            <ToolbarStepperContainer />
            <MuiToolbar className={classes.toolbar}>
              <Tooltip
                title={t('label.toggle_menu_title')}
                placement="bottom"
              >
                <span>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => props.toggleSidenav()}
                    edge="start"
                    className={clsx(props.sidenavOpened && classes.hide)}
                  >
                    <MenuIcon />
                  </IconButton>
                </span>
              </Tooltip>
              {!props.signalrOnline && (
                <WarningIcon
                  titleAccess={t('label.server_offline_title')}
                  className={classes.offlineIcon}
                />
              )}
              {(props.isInitiating ||
                props.changingProfile ||
                props.isUpdatingPrices) && (
                <CircularProgress
                  title={t('label.loading_title')}
                  className={classes.leftSpinner}
                  size={20}
                />
              )}
              <Grid
                container
                alignItems="center"
                justify="flex-end"
                className={classes.toolbarGrid}
              >
              <Grid item className={classes.profileArea} data-tour-elem="profileArea">
                  <Tooltip
                    title={t('label.edit_profile_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={
                          props.isSnapshotting ||
                          !props.activeProfile ||
                          props.isInitiating ||
                          !props.profilesLoaded ||
                          !props.signalrOnline
                        }
                        aria-label="edit"
                        className={classes.iconButton}
                        onClick={() => props.handleProfileOpen(true)}
                      >
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <FormControl className={classes.formControl}>
                    <Select
                      disabled={
                        props.isSnapshotting ||
                        props.isInitiating ||
                        !props.profilesLoaded ||
                        !props.signalrOnline
                      }
                      className={classes.selectMenu}
                      value={Dd.getDropdownSelection(
                        Dd.mapDomainToDropdown(props.profiles),
                        props.activeProfile ? props.activeProfile.uuid : ''
                      )}
                      onChange={e => props.handleProfileChange(e)}
                      inputProps={{
                        name: 'profile',
                        id: 'profile-dd'
                      }}
                    >
                      {props.profiles.map((profile: Profile) => {
                        return (
                          <MenuItem key={profile.uuid} value={profile.uuid}>
                            {profile.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <Tooltip
                    title={t('label.create_profile_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={
                          props.isSnapshotting ||
                          !props.profilesLoaded ||
                          props.isInitiating ||
                          !props.signalrOnline
                        }
                        onClick={() => props.handleProfileOpen()}
                        aria-label="create"
                        className={classes.iconButton}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={t('label.remove_profile_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={
                          props.isSnapshotting ||
                          props.profiles.length < 2 ||
                          props.isInitiating ||
                          !props.profilesLoaded ||
                          !props.signalrOnline
                        }
                        onClick={() => props.handleRemoveProfile()}
                        aria-label="remove profile"
                        className={classes.iconButton}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item className={classes.divider}></Grid>
                <Grid item className={classes.snapshotArea} data-tour-elem="snapshotArea">
                  <Tooltip
                    title={t('label.fetch_snapshot_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={
                          !props.activeProfile ||
                          !props.activeProfile.readyToSnapshot ||
                          !props.signalrOnline ||
                          props.autoSnapshotting
                        }
                        onClick={() => props.handleSnapshot()}
                        aria-label="snapshot"
                        className={classes.iconButton}
                      >
                        {!props.isSnapshotting ? (
                          <UpdateIcon fontSize="small" />
                        ) : (
                          <CircularProgress
                            className={classes.spinner}
                            size={20}
                          />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={t('label.remove_snapshot_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={
                          !props.activeProfile ||
                          props.isSnapshotting ||
                          !props.signalrOnline ||
                          props.activeProfile.snapshots.length === 0
                        }
                        onClick={() => props.handleClearSnapshots()}
                        aria-label="clear snapshots"
                        className={classes.iconButton}
                      >
                        <DeleteSweepIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item className={classes.divider}></Grid>
                <Grid item className={classes.groupArea} data-tour-elem="groupArea">
                  <Tooltip
                    title={t('label.group_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        disabled={!props.signalrOnline}
                        onClick={() => props.toggleGroupOverview()}
                        aria-label="group"
                        aria-haspopup="true"
                        className={clsx(classes.iconButton)}
                      >
                        <GroupIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item className={classes.divider}></Grid>
                <Grid item className={classes.miscArea}>
                  <Tooltip
                    title={t('label.notification_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        data-tour-elem="notificationList"
                        onClick={e => props.handleNotificationsOpen(e)}
                        aria-label="show new notifications"
                        color="inherit"
                        className={clsx(classes.iconButton)}
                      >
                        <Badge
                          max={9}
                          badgeContent={
                            props.unreadNotifications.length > 0
                              ? props.unreadNotifications.length
                              : undefined
                          }
                          classes={{ badge: classes.badge }}
                        >
                          <NotificationsIcon fontSize="small" />
                        </Badge>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={t('label.account_icon_title')}
                    placement="bottom"
                  >
                    <span>
                      <IconButton
                        onClick={e => props.handleAccountMenuOpen(e)}
                        aria-label="account"
                        aria-haspopup="true"
                        className={clsx(classes.iconButton)}
                      >
                        <AccountCircle fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>
            </MuiToolbar>
          </AppBar>
          <AccountMenuContainer />
          <NotificationListContainer />
          <ProfileDialogContainer
            profile={props.activeProfile}
            isOpen={props.profileOpen}
            isEditing={props.isEditing}
            handleClickClose={props.handleProfileClose}
            handleClickOpen={props.handleProfileOpen}
          />
          <CreateGroupDialogContainer />
        </>
      )}
    </>
  );
};

export default observer(Toolbar);
