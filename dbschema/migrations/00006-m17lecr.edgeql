CREATE MIGRATION m17lecrmwwmcil3js7l5iclpralo5p6jvl7kgaeozbxxzuxixck46q
    ONTO m1dzfsu6jpgbdb4wkcudzvpc4tocqpldpfhuweey4wkeuqnpr5p4fa
{
  ALTER TYPE default::GroupServer {
      CREATE PROPERTY owner: std::str;
  };
};
