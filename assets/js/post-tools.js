jQuery(function ($) {
  $("#nota-tools-run").click(function (e) {
    e.preventDefault();
    $.post(notaTools.ajaxUrl, {
      action: "nota_action",
      nota_action: "get_text_summary",
      nonce: notaTools.nonce,
      // this gets the edited content
      html: wp.data.select("core/editor").getEditedPostContent(),
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});
