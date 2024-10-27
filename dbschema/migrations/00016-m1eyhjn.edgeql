CREATE MIGRATION m1eyhjngd45rqcv5hbvugtk2etyozge324zwni27msgigrhwmhu5vq
    ONTO m1pypb443od25437ryawikt664qed7nxcjelpechcnukfwoplxiisa
{
  ALTER TYPE default::Account {
      ALTER LINK joined {
          ON SOURCE DELETE DELETE TARGET;
          RESET ON TARGET DELETE;
      };
  };
  ALTER TYPE default::GroupServer {
      ALTER LINK messages {
          ON SOURCE DELETE DELETE TARGET;
          RESET ON TARGET DELETE;
      };
      ALTER LINK users {
          ON SOURCE DELETE DELETE TARGET;
          RESET ON TARGET DELETE;
      };
  };
};
