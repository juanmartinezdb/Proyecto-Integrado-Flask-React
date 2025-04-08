import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Map as ZoneIcon,
  Star as SkillIcon,
  Shield as GearIcon
} from '@mui/icons-material';

// Contextos
import { useUser } from '../../contexts/UserContext';
import { useZone } from '../../contexts/ZoneContext';

// Ancho del sidebar
const SIDEBAR_WIDTH = 280;

const LeftSidebar = ({ open, onClose, zoneColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userData, loading: userLoading } = useUser();
  const { zones, currentZone, changeZone, loading: zonesLoading } = useZone();
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    mana: 0,
    coins: 0,
    gems: 0,
    honorificTitle: 'Novice Explorer'
  });
  const [activeGear, setActiveGear] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  
  // Cargar datos del usuario y estadísticas
  useEffect(() => {
    if (userData) {
      // Actualizar estadísticas del usuario
      setUserStats({
        level: userData.level || 1,
        xp: userData.xp || 0,
        xpToNextLevel: userData.level * 100, // Cálculo simple para el siguiente nivel
        mana: userData.mana || 0,
        coins: userData.coins || 0,
        gems: userData.blue_gems || 0,
        honorificTitle: userData.title || 'Novice Explorer'
      });
      
      // Aquí se cargarían los datos de equipo y habilidades activas
      // desde el backend en una implementación completa
      setActiveGear([
        { id: 1, name: 'Apprentice Robe', effect: '+5% XP gain' },
        { id: 2, name: 'Focus Amulet', effect: '+10 Mana' }
      ]);
      
      setActiveSkills([
        { id: 1, name: 'Time Management', effect: '+15% Task efficiency' },
        { id: 2, name: 'Deep Focus', effect: '-10% Energy cost for difficult tasks' }
      ]);
    }
  }, [userData]);
  
  // Calcular el progreso de XP para el siguiente nivel
  const calculateXpProgress = () => {
    const { xp, xpToNextLevel } = userStats;
    return (xp / xpToNextLevel) * 100;
  };
  
  // Manejador para cambiar de zona
  const handleZoneChange = (zoneId) => {
    changeZone(zoneId);
    if (isMobile) {
      onClose();
    }
  };
  
  // Renderizar el contenido del sidebar
  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        overflow: 'hidden'
      }}
    >
      {/* Botón de cierre para móviles */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Sección superior: Perfil de usuario */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(zoneColor || theme.palette.primary.main, 0.05)
        }}
      >
        {/* Cabecera con avatar y nombre */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          pb: 1.5
        }}>
          {/* Avatar del usuario */}
          <Avatar
            src={userData?.avatar_image || '/src/assets/default-avatar.png'}
            alt={userData?.username || 'User'}
            sx={{ 
              width: 56, 
              height: 56, 
              border: `2px solid ${zoneColor || theme.palette.primary.main}`,
              boxShadow: `0 0 8px ${alpha(zoneColor || theme.palette.primary.main, 0.4)}`
            }}
          />
          
          {/* Nombre de usuario y título */}
          <Box sx={{ ml: 2, flex: 1, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {userData?.username || 'User'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {userStats.honorificTitle}
            </Typography>
          </Box>
        </Box>
        
        {/* Estadísticas del usuario */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={500}>Level {userStats.level}</Typography>
            <Typography variant="body2" color="text.secondary">{userStats.xp}/{userStats.xpToNextLevel} XP</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateXpProgress()} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: alpha(theme.palette.grey[300], 0.5),
              '& .MuiLinearProgress-bar': {
                bgcolor: zoneColor || theme.palette.primary.main,
                backgroundImage: `linear-gradient(90deg, 
                  ${alpha(zoneColor || theme.palette.primary.main, 0.8)} 0%, 
                  ${zoneColor || theme.palette.primary.main} 50%, 
                  ${alpha(zoneColor || theme.palette.primary.main, 0.9)} 100%)`
              }
            }} 
          />
        </Box>
        
        {/* Mana, monedas y gemas */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          px: 2, 
          pb: 2,
          gap: 1
        }}>
          <Tooltip title="Mana Points">
            <Chip 
              label={`${userStats.mana} MP`} 
              size="small" 
              color="primary" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                '& .MuiChip-label': { px: 1 }
              }} 
            />
          </Tooltip>
          <Tooltip title="Coins">
            <Chip 
              label={`${userStats.coins} 🪙`} 
              size="small" 
              color="warning" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                '& .MuiChip-label': { px: 1 }
              }} 
            />
          </Tooltip>
          <Tooltip title="Blue Gems">
            <Chip 
              label={`${userStats.gems} 💎`} 
              size="small" 
              color="info" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                '& .MuiChip-label': { px: 1 }
              }} 
            />
          </Tooltip>
        </Box>
      </Box>
      
      {/* Sección media: Zonas */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      }}>
        <Typography variant="subtitle1" sx={{ 
          px: 2, 
          py: 1, 
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.background.default, 0.6),
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          Zones
        </Typography>
        
        <Box sx={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
          }
        }}>
          <List sx={{ p: 0 }}>
            {/* Zona General (siempre presente) */}
            <ListItem disablePadding>
              <ListItemButton 
                selected={!currentZone || currentZone.name.toLowerCase() === 'general'}
                onClick={() => handleZoneChange(zones.find(z => z.name.toLowerCase() === 'general')?.id)}
                sx={{
                  pl: 2,
                  borderLeft: !currentZone || currentZone.name.toLowerCase() === 'general' 
                    ? `4px solid ${theme.palette.primary.main}` 
                    : '4px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ZoneIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="General Zone" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: !currentZone || currentZone.name.toLowerCase() === 'general' ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
            
            {/* Lista de zonas del usuario */}
            {zones
              .filter(zone => zone.name.toLowerCase() !== 'general')
              .map((zone) => (
                <ListItem key={zone.id} disablePadding>
                  <ListItemButton 
                    selected={currentZone?.id === zone.id}
                    onClick={() => handleZoneChange(zone.id)}
                    sx={{
                      pl: 2,
                      borderLeft: currentZone?.id === zone.id 
                        ? `4px solid ${zone.color || theme.palette.primary.main}` 
                        : '4px solid transparent',
                      '&.Mui-selected': {
                        bgcolor: alpha(zone.color || theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(zone.color || theme.palette.primary.main, 0.2),
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ZoneIcon 
                        sx={{ color: zone.color || theme.palette.primary.main }} 
                        fontSize="small"
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={zone.name} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: currentZone?.id === zone.id ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>
      
      {/* Sección inferior: Equipo y habilidades activas */}
      <Box sx={{ 
        maxHeight: '35%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Typography variant="subtitle1" sx={{ 
          px: 2, 
          py: 1, 
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.background.default, 0.6),
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          Active Gear & Skills
        </Typography>
        
        <Box sx={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
          }
        }}>
          <Box sx={{ px: 2, pt: 1 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              mb: 0.5, 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center'
            }}>
              <GearIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
              Gear
            </Typography>
            <List dense sx={{ mb: 1.5 }}>
              {activeGear.map((item) => (
                <ListItem key={item.id} sx={{ py: 0, px: 1 }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={item.effect} 
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="body2" sx={{ 
              fontWeight: 600, 
              mb: 0.5, 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center'
            }}>
              <SkillIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.secondary.main }} />
              Skills
            </Typography>
            <List dense sx={{ mb: 1 }}>
              {activeSkills.map((skill) => (
                <ListItem key={skill.id} sx={{ py: 0, px: 1 }}>
                  <ListItemText 
                    primary={skill.name} 
                    secondary={skill.effect} 
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  
  return (
    <>
      {isMobile ? (
        // Drawer para dispositivos móviles (se desliza desde el lado)
        <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        // Drawer permanente para escritorio
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: open ? SIDEBAR_WIDTH : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              top: '128px', // Altura del navbar + energybar
              height: 'calc(100% - 128px)',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
};

export default LeftSidebar;