const relationshipsInit = (mysql) => {
  // TODO accounts
  // mysql.models.account.belongsTo(mysql.models.organization, {
  //   foreignKey: 'org_id',
  // });
  // mysql.models.contact.hasMany(mysql.models.contact, {
  //   foreignKey: 'account_id',
  // });

  // // TODO model
  // mysql.models.model.hasMany(mysql.models.conversation, {
  //   foreignKey: 'model_id',
  // });

  // // TODO digitalTwin
  // mysql.models.digitaltwin.belongsTo(mysql.models.user, {
  //   foreignKey: 'user_id',
  // });
  // mysql.models.digitaltwin.belongsTo(mysql.models.model, {
  //   foreignKey: 'model_id',
  // });
  // mysql.models.digitaltwin.hasMany(mysql.models.digitaltwinmoment, {
  //   foreignKey: 'digital_twin_id',
  // });
  // mysql.models.digitaltwin.hasMany(mysql.models.digitaltwinscore, {
  //   foreignKey: 'digital_twin_id',
  // });

  // // TODO digitaltwinmoment
  // mysql.models.digitaltwinmoment.belongsTo(mysql.models.digitaltwin, {
  //   foreignKey: 'digital_twin_id',
  // });

  // // TODO digitaltwinscore
  // mysql.models.digitaltwinscore.belongsTo(mysql.models.digitaltwin, {
  //   foreignKey: 'digital_twin_id',
  // });

  // // TODO contact
  // mysql.models.contact.belongsTo(mysql.models.account, {
  //   foreignKey: 'account_id',
  // });
  // mysql.models.contact.hasMany(mysql.models.conv_contact, {
  //   foreignKey: 'contact_id',
  // });
  // mysql.models.contact.hasMany(mysql.models.contact_profile, {
  //   foreignKey: 'contact_id',
  // });

  // // TODO contact_profile
  // mysql.models.contact_profile.belongsTo(mysql.models.contact, {
  //   foreignKey: 'contact_id',
  // });

  // // TODO conv_contact
  // mysql.models.conv_contact.belongsTo(mysql.models.contact, {
  //   foreignKey: 'contact_id',
  // });
  // mysql.models.conv_contact.belongsTo(mysql.models.conversation, {
  //   foreignKey: 'conversation_id',
  // });
  // mysql.models.conv_contact.hasMany(mysql.models.conv_transcript, {
  //   foreignKey: 'conv_contacts_id',
  // });
  // mysql.models.conv_contact.hasMany(mysql.models.conv_observation, {
  //   foreignKey: 'conv_contacts_id',
  // });
  // mysql.models.conv_contact.hasMany(mysql.models.conv_action, {
  //   foreignKey: 'conv_contacts_id',
  // });

  // // TODO conv_score
  // mysql.models.conv_score.belongsTo(mysql.models.conversation, {
  //   foreignKey: 'conversation_id',
  // });

  // // TODO conversation
  // mysql.models.conversation.belongsTo(mysql.models.user, {
  //   foreignKey: 'user_id',
  // });
  // mysql.models.conversation.belongsTo(mysql.models.model, {
  //   foreignKey: 'model_id',
  // });
  // mysql.models.conversation.hasMany(mysql.models.conv_contact, {
  //   foreignKey: 'conversation_id',
  // });
  // mysql.models.conversation.hasMany(mysql.models.conv_recording_files, {
  //   foreignKey: 'conversation_id',
  // });

  // // TODO conv_action
  // mysql.models.conv_action.belongsTo(mysql.models.conv_contact, {
  //   foreignKey: 'conv_contacts_id',
  // });

  // // TODO conv_observation
  // mysql.models.conv_observation.belongsTo(mysql.models.conv_contact, {
  //   foreignKey: 'conv_contacts_id',
  // });
  // mysql.models.conv_obv_decision.hasMany(mysql.models.conv_observation, {
  //   foreignKey: 'conv_observation_id',
  // });

  // // TODO conv_obv_decision
  // mysql.models.conv_obv_decision.belongsTo(mysql.models.conv_observation, {
  //   foreignKey: 'conv_observation_id',
  // });

  // // TODO conv_recording_files
  // mysql.models.conv_recording_files.belongsTo(mysql.models.conversation, {
  //   foreignKey: 'conversation_id',
  // });
  // mysql.models.conv_recording_files.belongsTo(mysql.models.connector, {
  //   foreignKey: 'connector_id',
  // });

  // // TODO conv_transcript
  // mysql.models.conv_transcript.belongsTo(mysql.models.conv_contact, {
  //   foreignKey: 'conv_contacts_id',
  // });
  // mysql.models.conv_transcript.hasMany(mysql.models.conv_transcript_tag, {
  //   foreignKey: 'conv_transcript_id',
  // });

  // // TODO conv_transcript_tags
  // mysql.models.conv_transcript_tag.belongsTo(mysql.models.conv_transcript, {
  //   foreignKey: 'conv_trascript_id',
  // });
  // mysql.models.conv_transcript_tag.belongsTo(
  //   mysql.models.conv_tags_type,
  //   {
  //     foreignKey: 'conv_tags_type',
  //     as: 'ConvTagsType',
  //   },
  // );

  // // TODO conv_tags_type
  // mysql.models.conv_tags_type.hasMany(mysql.models.conv_transcript_tag, {
  //   foreignKey: 'conv_tags_type',
  //   as: 'ConvTagsType',
  // });

  // // TODO connector
  // mysql.models.connector.belongsTo(mysql.models.organization, {
  //   foreignKey: 'org_id',
  // });
  // mysql.models.connector.hasMany(mysql.models.webhookqueue, {
  //   foreignKey: 'connector_id',
  // });
  // mysql.models.connector.hasMany(mysql.models.conv_recording_files, {
  //   foreignKey: 'connector_id',
  // });

  // // TODO webhookqueue
  // mysql.models.webhookqueue.belongsTo(mysql.models.connector, {
  //   foreignKey: 'connector_id',
  // });

  // // TODO user
  // mysql.models.user.belongsTo(mysql.models.organization, {
  //   foreignKey: 'org_id',
  // });
  // mysql.models.user.hasMany(mysql.models.conversation, {
  //   foreignKey: 'user_id',
  // });
  // mysql.models.user.hasMany(mysql.models.conv_contact, {
  //   foreignKey: 'user_id',
  // });
  // // TODO unomment when comments added to sequelize definitions
  // // mysql.models.user.hasMany(mysql.models.comment, {
  // //     foreignKey: 'user_id',
  // //   });
  // mysql.models.user.hasMany(mysql.models.digitaltwin, {
  //   foreignKey: 'user_id',
  // });
  // mysql.models.user.hasMany(mysql.models.model, {
  //   foreignKey: 'user_id',
  // });

  // // TODO sessions

  // // TODO organization
  // mysql.models.organization.hasMany(mysql.models.account, {
  //   foreignKey: 'org_id',
  // });
  // mysql.models.organization.hasMany(mysql.models.contact, {
  //   foreignKey: 'org_id',
  // });

  return mysql;
};

export default relationshipsInit;
