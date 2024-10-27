CREATE MIGRATION m1vbayjdgqsw3uewb4auua4u7d5z33aao53tudnhkzw3yff56zsm4q
    ONTO m17xutghl2gxs6crl2y7uvtrupvygindjcxssg4ghbxixduuubylka
{
  ALTER TYPE default::GroupServer {
      DROP LINK users;
      CREATE MULTI LINK users: default::Account {
          ON TARGET DELETE ALLOW;
      };
  };
  DROP TYPE default::Users;
};
