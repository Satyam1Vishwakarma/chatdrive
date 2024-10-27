CREATE MIGRATION m1ttv4nr2dhw7xrpyvah6nnwhljmaqxzxjfeh44clfdcgu3xp5gs7a
    ONTO m1hyxj7rxtwivct7qouyrzqxnmkj2tk4exundopj3w2ls4ftso3gua
{
  ALTER TYPE default::GroupServer {
      ALTER LINK account {
          RENAME TO users;
      };
  };
};
