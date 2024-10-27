CREATE MIGRATION m1pypb443od25437ryawikt664qed7nxcjelpechcnukfwoplxiisa
    ONTO m1vogs7fxbikdzcba2ryuhey4suzu6cnhalfxdrpo6o63jgl7mgqzq
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK messages {
          ON TARGET DELETE DELETE SOURCE;
      };
      ALTER LINK users {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
