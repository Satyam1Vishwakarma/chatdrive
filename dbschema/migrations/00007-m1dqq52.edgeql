CREATE MIGRATION m1dqq52y7umg5ndh2enb3gkfkqdjmlvukj2hkf6xbmcw4eg3dczlvq
    ONTO m17lecrmwwmcil3js7l5iclpralo5p6jvl7kgaeozbxxzuxixck46q
{
  CREATE TYPE default::Users {
      CREATE PROPERTY canread: std::bool;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY userid: std::str;
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK account {
          SET TYPE default::Users USING (.account[IS default::Users]);
      };
  };
};
