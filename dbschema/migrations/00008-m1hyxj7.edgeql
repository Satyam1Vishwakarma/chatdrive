CREATE MIGRATION m1hyxj7rxtwivct7qouyrzqxnmkj2tk4exundopj3w2ls4ftso3gua
    ONTO m1dqq52y7umg5ndh2enb3gkfkqdjmlvukj2hkf6xbmcw4eg3dczlvq
{
  ALTER TYPE default::GroupServer {
      ALTER LINK account {
          ON TARGET DELETE ALLOW;
      };
  };
};
