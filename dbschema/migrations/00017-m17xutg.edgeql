CREATE MIGRATION m17xutghl2gxs6crl2y7uvtrupvygindjcxssg4ghbxixduuubylka
    ONTO m1eyhjngd45rqcv5hbvugtk2etyozge324zwni27msgigrhwmhu5vq
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK messages {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK users {
          ON TARGET DELETE ALLOW;
      };
  };
};
