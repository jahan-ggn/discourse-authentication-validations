# frozen_string_literal: true

module ::DiscourseAuthenticationValidations
  class Engine < ::Rails::Engine
    engine_name DiscourseAuthenticationValidations
    isolate_namespace DiscourseAuthenticationValidations
    config.autoload_paths << File.join(config.root, "lib")
  end
end
